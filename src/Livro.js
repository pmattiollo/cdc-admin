import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from "pubsub-js";
import InputCustomizado from './componentes/InputCustomizado';
import InputSubmit from './componentes/InputSubmit';
import SelectCustomizado from './componentes/SelectCustomizado';
import TratadorErros from "./TratadorErros";

class LivroBox extends Component {

    constructor() {
        super();
        this.state = {livros: [], autores: []};
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de livros</h1>
                </div>
                <div className="content" id="content">
                    <FormularioLivro autores={this.state.autores}/>
                    <TabelaLivros lista={this.state.livros}/>
                </div>
            </div>
        )
    }

    componentDidMount() {
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            dataType: 'json',
            success: ((response) => this.setState({livros: response})).bind(this)
        });

        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success: ((response) => this.setState({autores: response})).bind(this)
        });

        PubSub.subscribe('atualiza-lista-livros', ((topico, novaLista) => this.setState({livros: novaLista})).bind(this));
    }

}

class FormularioLivro extends Component {

    constructor() {
        super();
        this.state = {titulo: '',preco: '',autorId: ''};
        this.enviaForm = this.enviaForm.bind(this);
        this.setTitulo = this.setTitulo.bind(this);
        this.setPreco = this.setPreco.bind(this);
        this.setAutorId = this.setAutorId.bind(this);
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="titulo" type="text" name="titulo" label="Título" value={this.state.titulo} onChange={this.setTitulo}/>
                    <InputCustomizado id="preco" type="text" name="preco" label="Preço" value={this.state.preco} onChange={this.setPreco}/>
                    <SelectCustomizado id="autorId" label="Autor" onChange={this.setAutorId} defaultOption="Selecione autor" lista={this.props.autores}/>
                    <InputSubmit label="Gravar" />
                </form>
            </div>
        )
    }

    enviaForm(event) {
        event.preventDefault();

        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/livros',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({titulo: this.state.titulo, preco: this.state.preco, autorId: this.state.autorId}),
            success: ((response) => {
                PubSub.publish('atualiza-lista-livros', response);
                this.setState({titulo: '',preco: '',autorId: ''});
            }).bind(this),
            error: (response) =>  {
                if (response.status === 400) {
                    new TratadorErros().publicaErros(response.responseJSON);
                }
            },
            beforeSend: () => PubSub.publish('limpa-erros', {})
        });
    }

    setTitulo(evento){
        this.setState({titulo: evento.target.value});
    }

    setPreco(evento){
        this.setState({preco: evento.target.value});
    }

    setAutorId(evento){
        this.setState({autorId: evento.target.value});
    }

}

class TabelaLivros extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                    <tr>
                        <th>Título</th>
                        <th>Preço</th>
                        <th>Autor</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.lista.map((livro) => {
                            return (
                                <tr key={livro.id}>
                                    <td>{livro.titulo}</td>
                                    <td>{livro.preco}</td>
                                    <td>{livro.autor.nome}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }

}

export default LivroBox