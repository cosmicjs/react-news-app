import React, { Component } from 'react';

class Loader extends Component{
	constructor(props){
		super(props)
	}

	render(){
		const message = this.props.message;
		return (
			<div className="loader">
				{ message ? <span>{message}</span> : '' }
			</div>
		)
	}
}

export default Loader;
