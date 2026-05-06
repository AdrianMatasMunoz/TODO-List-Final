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