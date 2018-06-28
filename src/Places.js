import React, {Component} from 'react';


class Places extends Component {
	constructor(props) {
		super(props);
		this.state = {
			choosenLocations: ''
		};
		this.chooseLocations = this.chooseLocations.bind(this);
	}
	componentWillMount() {
		this.setState({
			choosenLocations: this.props.locations

		});

	}
	//function will filter out the options
	chooseLocations(event) {
		var choosenlocations = []
		this.props.locations.forEach(function (loc) {
			if (loc.name.toLowerCase().includes(event.toLowerCase())) {
				loc.marker.setVisible(true);
				choosenlocations.push(loc);
			} else {
				loc.marker.setVisible(false);
			}
		});
		this.setState({
			choosenLocations: choosenlocations
		})

	}
	//function for toggling hamburger icon
	open = function () {
		const side = document.querySelector('.sidebar');

		(side.style.display === 'none') ? (side.style.display = 'block') : (side.style.display = 'none');
	}

	render(){
			const {infowindow} = this.props;
	//funtion to create location list
	var addlocations = this.state.choosenLocations.map(function(list,index){
         return(
         	 <li key={index} role="button" tabIndex="0" onKeyPress={infowindow.bind(this, list.marker)} onClick={infowindow.bind(this, list.marker)}>{list.name}</li> 
			
			);
         	})
         	
         
		return(
		<div>
                <div className="hamburgers" onClick={this.open}>
                    <div className="ham"></div>
                    <div className="ham"></div>
                    <div className="ham"></div>
                </div>
                <div className="sidebar">

        			<div id="search-text">
       			 	<input className="search" type="text" aria-labelledby="search places" placeholder="enter place to view " onChange = {e => this.chooseLocations(e.target.value)}/> 
        		 	</div>
        		 	<ul>
         			{addlocations}
         			</ul>
        		</div>
        </div>
        )
	}
}
export default Places;