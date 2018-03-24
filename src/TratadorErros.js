import PubSub from 'pubsub-js';

class TratadorErros {

    publicaErros(response) {
        for (let i=0;i<response.errors.length;i++) {
            var erro = response.errors[i];
            PubSub.publish('erro-validacao', erro);
        }
    }

}

export default TratadorErros