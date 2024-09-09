class RecintosZoo {
    constructor() {
        this.animais = {
            "LEAO": { tamanho: 3, bioma: ["savana"], carnivoro: true },
            "LEOPARDO": { tamanho: 2, bioma: ["savana"], carnivoro: true },
            "CROCODILO": { tamanho: 3, bioma: ["rio"], carnivoro: true },
            "MACACO": { tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
            "GAZELA": { tamanho: 2, bioma: ["savana"], carnivoro: false },
            "HIPOPOTAMO": { tamanho: 4, bioma: ["savana", "rio"], carnivoro: false }
        };

        this.recintos = [
            { numero: 1, bioma: ["savana"], tamanhoTotal: 10, ocupacao: 3, animais: ["MACACO"] },
            { numero: 2, bioma: ["floresta"], tamanhoTotal: 5, ocupacao: 0, animais: [] },
            { numero: 3, bioma: ["savana", "rio"], tamanhoTotal: 7, ocupacao: 2, animais: ["GAZELA"] },
            { numero: 4, bioma: ["rio"], tamanhoTotal: 8, ocupacao: 0, animais: [] },
            { numero: 5, bioma: ["savana"], tamanhoTotal: 9, ocupacao: 3, animais: ["LEAO"] }
        ];
    }

    // Método que verifica animais compativeis no recinto
    verificaAnimaisCompativeis(recinto, infoAnimal, animal, quantidade) {

        // Regra especifica para o Macaco
        if (animal === "MACACO" && quantidade === 1 && recinto.animais.length === 0) {
            return false;
        }

        return !recinto.animais.some(animalRecinto => {
            const animalNoRecinto = this.animais[animalRecinto];

            // Regra especifica para Hipopotamo
            const recintoComHipopotamo = animalRecinto === "HIPOPOTAMO";
            if (recintoComHipopotamo) {
                return !(recinto.bioma.includes("savana") && recinto.bioma.includes("rio"));
            }

            const carnivoroIncompativel = animalNoRecinto.carnivoro !== infoAnimal.carnivoro;
            const ambosCarnivoros = animalNoRecinto.carnivoro && infoAnimal.carnivoro;

            return carnivoroIncompativel || (ambosCarnivoros && animalNoRecinto !== infoAnimal);
        });
    }

    // Método que verifica o espaço no recinto e retorna seu espaço real
    garanteEspacoNoRecinto(recinto, infoAnimal, quantidade, animal) {
        const espacoNecessario = infoAnimal.tamanho * quantidade;
        let espacoLivre = recinto.tamanhoTotal - recinto.ocupacao;

        if (recinto.animais.length > 0 && !recinto.animais.includes(animal)) {
            espacoLivre -= 1;
        }

        const espacoReal = espacoLivre - espacoNecessario;

        return espacoReal;
    }

    // Método que verifica recintos compativeis com o animal e garante que há espaço
    verificaRecintoCompativel(recinto, infoAnimal, quantidade, animal) {
        const biomaCompativel = infoAnimal.bioma.some(bioma => recinto.bioma.includes(bioma));
        const espacoRestante = this.garanteEspacoNoRecinto(recinto, infoAnimal, quantidade, animal);

        return biomaCompativel && espacoRestante >= 0;
    }

    // Método que recebe animal e sua quantidade para retornar os recintos viaveis
    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }

        const infoAnimal = this.animais[animal];
        const recintosViaveis = [];

        for (const recinto of this.recintos) {
            const espacoReal = this.garanteEspacoNoRecinto(recinto, infoAnimal, quantidade, animal);

            if (this.verificaRecintoCompativel(recinto, infoAnimal, quantidade, animal) &&
                this.verificaAnimaisCompativeis(recinto, infoAnimal, animal, quantidade)) {

                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: espacoReal,
                    total: recinto.tamanhoTotal
                });
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        const resultRecintos = recintosViaveis
            .map(recinto => `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.total})`);

        return { erro: null, recintosViaveis: resultRecintos };
    }
}

export { RecintosZoo as RecintosZoo };
