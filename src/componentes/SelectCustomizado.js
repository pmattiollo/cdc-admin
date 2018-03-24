import React, { Component } from 'react';

class SelectCustomizado extends Component {

    render() {
        return (
            <div className="pure-control-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <select name={this.props.id} onChange={this.props.onChange}>
                    <option value="">{this.props.defaultOption}</option>
                    {
                        this.props.lista.map((elemento) => <option key={elemento.id} value={elemento.id}>{elemento.nome}</option>)
                    }
                </select>
            </div>
        )
    }

}

export default SelectCustomizado