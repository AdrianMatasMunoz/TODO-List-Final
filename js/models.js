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

export class Util {
    static formatNumber(num, len) {
        num = num.toString();

        while(num.length < len)
            num = "0" + num;

        return num;
    }

    static getCategoriaByName(name) {
        let categoriesJSON = localStorage.getItem("categories");
        if(categoriesJSON === null) return null;
        categoriesJSON = JSON.parse(categoriesJSON);

        let categoria = null;
        categoriesJSON.forEach((v) => {
            if(categoria === null && v.nom === name)
                categoria = v;
        });

        return (categoria === null ? null : new Categoria(categoria.nom, categoria.color));
    }

    static adaptForHTML(text) {
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
    }

    static countTaskDoneState(tasques, done) {
        let count = 0;
        tasques.forEach((v) => {
            if(v.feta == done) count++;
        });
        return count;
    }

    static taskExists(id) {
        let tasquesJSON = localStorage.getItem("tasques");
        if(tasquesJSON === null) return null;
        tasquesJSON = JSON.parse(tasquesJSON);

        let existeix = false;
        tasquesJSON.forEach((v) => {
            existeix = existeix || v.id === id;
        });

        return existeix;
    }

    static getNextTaskId(tasques) {
        let num = tasques.length;
        do num++;
        while(Util.taskExists(`${Util.formatNumber(num, 3)}`));
        return `${Util.formatNumber(num, 3)}`;
    }
}

export class Tasca {
    #id;
    #titol;
    #descripcio;
    #data;
    #categoria;
    #prioritat;
    #feta;

    constructor(id, titol, descripcio, data, categoria, prioritat) {
        this.#id = id;
        this.#titol = titol;
        this.#descripcio = descripcio;
        this.#data = new Date(data);
        this.#categoria = categoria;
        switch(prioritat) {
            case 'Baixa':
                this.#prioritat = Prioritat.BAIXA;
                break;
            case 'Mitjana':
                this.#prioritat = Prioritat.MITJANA;
                break;
            case 'Alta':
                this.#prioritat = Prioritat.ALTA;
                break;
            default:
                throw `TaskCreationException: Category "${prioritat}" is invalid.`;
        }
        this.#feta = false;
    }

    get id() {
        return this.#id;
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
            id: this.#id,
            titol: this.#titol,
            descripcio: this.#descripcio,
            data: `${Util.formatNumber(this.#data.getFullYear(), 4)}-${Util.formatNumber(this.#data.getMonth()+1, 2)}-${Util.formatNumber(this.#data.getDate(), 2)}`,
            categoria: this.#categoria.toJSON(),
            prioritat: this.prioritat,
            feta: this.#feta
        };
    }
}