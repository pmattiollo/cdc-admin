import React, { Component } from 'react';
import $ from "jquery";
import InputCustomizado from './componentes/InputCustomizado';
import InputSubmit from './componentes/InputSubmit';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros'

class AutorBox extends Component {

    constructor() {
        super();
        this.state = {lista: []};
    }

    render() {
        return (
            <div>
                <div className="header">
                    <h1>Cadastro de autores</h1>
                </div>
                <div className="content" id="content">
                    <FormularioAutor/>
                    <TabelaAutores lista={this.state.lista}/>
                </div>
            </div>
        )
    }

    componentDidMount() {
        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            dataType: 'json',
            success: ((response) => this.setState({lista: response})).bind(this)
        });

        PubSub.subscribe('atualiza-lista-autores', ((topico, novaLista) => this.setState({lista: novaLista})).bind(this));
    }

}

class FormularioAutor extends Component {

    constructor() {
        super();
        this.state = {nome: '', email: '', senha: ''};
        this.enviaForm = this.enviaForm.bind(this);
    }

    enviaForm(event) {
        event.preventDefault();

        $.ajax({
            url: 'http://cdc-react.herokuapp.com/api/autores',
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            data: JSON.stringify({nome: this.state.nome, email: this.state.email, senha: this.state.senha}),
            success: ((response) => {
                PubSub.publish('atualiza-lista-autores', response);
                this.setState({nome: '', email: '', senha: ''});
            }).bind(this),
            error: (response) =>  {
                if (response.status === 400) {
                    new TratadorErros().publicaErros(response.responseJSON);
                }
            },
            beforeSend: () => PubSub.publish('limpa-erros', {})
        });
    }

    render() {
        return (
            <div className="pure-form pure-form-aligned">
                <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
                    <InputCustomizado id="nome" type="text" name="nome" label="Nome" value={this.state.nome} onChange={this.salvaAlteracao.bind(this, 'nome')}/>
                    <InputCustomizado id="email" type="email" name="email" label="Email" value={this.state.email} onChange={this.salvaAlteracao.bind(this, 'email')}/>
                    <InputCustomizado id="senha" type="password" name="senha" label="Senha" value={this.state.senha} onChange={this.salvaAlteracao.bind(this, 'senha')}/>
                    <InputSubmit label="Gravar" />
                </form>
            </div>
        )
    }

    salvaAlteracao(input, event) {
        this.setState({[input]: event.target.value});
    }

}

class TabelaAutores extends Component {

    render() {
        return (
            <div>
                <table className="pure-table">
                    <thead>
                    <tr>
                        <th>Nome</th>
                        <th>email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.lista.map((autor) => {
                            return (
                                <tr key={autor.id}>
                                    <td>{autor.nome}</td>
                                    <td>{autor.email}</td>
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

export default AutorBox