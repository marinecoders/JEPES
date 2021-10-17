from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
from flask import send_from_directory

from data import data

app = Flask(__name__, static_url_path='/static')

class JEPES:
    raw_score_table = data
    
    def __init__(self):
        # var -> score_table has a range -> score value
        # new FY22 ARQ has a funky tuple -> score value so we need to calculate that
        # in a different location

        JEPES.raw_score_table["PHYSICAL TOUGHNESS"]["PFT"]["CPL"] = self.convert_json_to_dict(JEPES.raw_score_table["PHYSICAL TOUGHNESS"]["PFT"]["CPL"])
        JEPES.raw_score_table["PHYSICAL TOUGHNESS"]["CFT"]["CPL"] = self.convert_json_to_dict(JEPES.raw_score_table["PHYSICAL TOUGHNESS"]["CFT"]["CPL"])
        JEPES.raw_score_table["PHYSICAL TOUGHNESS"]["PFT"]["LCPL"] = self.convert_json_to_dict(JEPES.raw_score_table["PHYSICAL TOUGHNESS"]["PFT"]["LCPL"])
        JEPES.raw_score_table["PHYSICAL TOUGHNESS"]["CFT"]["LCPL"] = self.convert_json_to_dict(JEPES.raw_score_table["PHYSICAL TOUGHNESS"]["CFT"]["LCPL"])

        self.arq21 = self.convert_json_to_dict(
            JEPES.raw_score_table["WARFIGHTING"]["RIFLE"]["ARQ21"]
        )
        
        self.arq22 = JEPES.raw_score_table["WARFIGHTING"]["RIFLE"]["ARQ22"]

    def get_pft(self, rank: str, score: int):
        # restraints: PFT 0 - 300
        return self.raw_score_table["PHYSICAL TOUGHNESS"]["PFT"][rank.upper()][score]
    
    def get_cft(self, rank:str, score: int):
        # restraints: CFT 0 - 300
        # restraints: PFT 0 - 300

        return self.raw_score_table["PHYSICAL TOUGHNESS"]["CFT"][rank.upper()][score]

    def get_arq21(self, score: int) -> int:
        # restraints: ARQ21 0 - 300
        return self.arq21[score]

    def get_arq22(self, destroys:int, drills: int) -> int:
        return self.arq22[(destroys, drills)]

    def get_mcmap(self, rank, belt):
        # * LCPL or CPL
        return JEPES.raw_score_table['WARFIGHTING']['MCMAP'][rank][belt][0]
    
    def get_remarks(self, mos_msn: float, leadership: float, character: float):
        mos_msn *= 50
        leadership *= 50
        character *= 50
        line = mos_msn + leadership + character
        composite = line / 3

        return composite

    def get_bonus(self,  bonus_json):
        """
        "Bonus": {
        "DI School": False,
        "Recruiting School": False,
        "MSG School": False,
        "Combat Instructor": False,
        "MC Sec. Forces": False,
        "Command rec. Bonus": 0
        }
        """
        total = 0
        values = bonus_json.values()
        for bonus in values:
            if type(bonus) == int:
                total += (bonus * 20)

            elif type(bonus) == bool:
                if bonus:
                    total += 50
        if total >= 100:
            return 100

    def convert_json_to_dict(self, table):
        _tmp = {}
        for score, j in table.items():
            if '-' in score:
                # 0-149 splits into low(0), high(149) -> range(0, 149 + 1) so calls can be handled easier instead of searching
                low, high = score.split('-')
                for i in range(int(low), int(high) + 1):
                    _tmp[i] = j
            else:
                _tmp[int(score)] = j
        # iterates over score_table and sets self to name of period of scoring (PFT, CFT, ARQ21)
        return _tmp

@app.route('/')
def index():
    return render_template('calculator.html')

@app.route('/submit', methods = ['POST'])
def submit():
    print(request.json)
    print('yay')



@app.route('/belt/<string:rank>/<string:belt>')
def get_belt(rank, belt):
    _value = jepes.get_mcmap(rank.upper(), belt)
    return jsonify(
        {
            'Score': _value,
        }
    )

@app.route('/range/<int:destroys>/<int:drills>')
def get_range(destroys, drills):
    _score = jepes.get_arq22(destroys, drills)
    return jsonify(
        {
            'Score': _score[0],
            'Badge': _score[1]
        }
    )

@app.route('/pft/<string:rank>/<int:score>')
def get_pft(rank, score):
    _score = jepes.get_pft(rank, score)

    return jsonify(
        {
            'Score': _score
        }
    )

@app.route('/cft/<string:rank>/<int:score>')
def get_cft(rank, score):
    _score = jepes.get_cft(rank, score)

    return jsonify(
        {
            'Score': _score
        }
    )

@app.route('/webfonts/<path>')
def return_font(path):
    if path:
        return send_from_directory('webfonts', path)

if __name__ == '__main__':
    jepes = JEPES()

    app.run(
        host = '0.0.0.0',
        port = 80
    )