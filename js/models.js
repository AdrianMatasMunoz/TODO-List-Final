export class Categoria {
    #nom;
    #color;
    
    constructor(nom, color) {
        this.#nom = nom;
        this.#color = color;
    }

    get nom() {
        return this.#nom;
    }

    get color() {
        return this.#color;
    }

    toJSON() {
        return {
            nom: this.#nom,
            color: this.#color
        };
    }
}

export class Prioritat {
    static BAIXA = 0;
    static MITJANA = 1;
    static ALTA = 2;
}

class Util {
    static formatNumber(num, len) {
        num = num.toString();

        while(num.length < len)
            num = "0" + num;

        return num;
    }
}

export class Tasca {
    #titol;
    #descripcio;
    #data;
    #categoria;
    #prioritat;
    #feta;

    constructor(titol, descripcio, data, categoria, prioritat) {
        this.#titol = titol;
        this.#descripcio = descripcio;
        this.#data = new Date(data);
        this.#categoria = categoria;
        switch(prioritat) {
            case 'baixa':
                this.#prioritat = Prioritat.BAIXA;
                break;
            case 'mitjana':
                this.#prioritat = Prioritat.MITJANA;
                break;
            case 'alta':
                this.#prioritat = Prioritat.ALTA;
                break;
            default:
                throw `TaskCreationException: Category "${prioritat}" is invalid.`;
        }
        this.#feta = false;
    }

    get titol() {
        return this.#titol;
    }

    get descripcio() {
        return this.#descripcio;
    }

    get data() {
        return this.#data;
    }

    get categoria() {
        return this.#categoria;
    }

    get prioritat() {
        switch(this.#prioritat) {
            case Prioritat.BAIXA:
                return "Baixa";
            case Prioritat.MITJANA:
                return "Mitjana";
            case Prioritat.ALTA:
                return "Alta";
        }
        return "Error";
    }

    get feta() {
        return this.#feta;
    }

    set feta(v) {
        if(typeof(v) === "boolean")
            this.#feta = v;
    }

    toJSON() {
        return {
            titol: this.#titol,
            descripcio: this.#descripcio,
            data: `${Util.formatNumber(this.#data.getFullYear(), 4)}-${Util.formatNumber(this.#data.getMonth()+1, 2)}-${Util.formatNumber(this.#data.getDate(), 2)}`,
            categoria: this.#categoria.toJSON(),
            prioritat: this.prioritat,
            feta: this.#feta
        };
    }
}