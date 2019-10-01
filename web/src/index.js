import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Icon(props) {
    return (
    <div className="icon-content">
        <img src={"img/"+props.file} alt={props.name} width="100px"/>
        <p>{props.name}</p>
    </div>
    )
}

class Grid extends React.Component {

    constructor() {
        super();
        this.LEFT = 1;
        this.RIGHT = 2;
        this.state = {
            categories: [],
            subjects: [],
            left_category: null,
            right_category: null,
            left_subject: null,
            right_subject: null
        }
    }

    async fetch_and_load(uri, target) {
        const response = await fetch(uri);
        try {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                response.status);
                return;
            }
            // Examine the text in the response
            const json = await response.json()
            this.setState({[target]: json})
            // console.log(this.state)
          } catch (err) {
            console.log('Fetch Error:', err);
          }
    }

    async componentDidMount() {
        await this.fetch_and_load("http://localhost:5000/api/categories", "categories")
        await this.fetch_and_load("http://localhost:5000/api/subjects", "subjects")
    }

    handleCategoryClick(id, side) {
        if (side === this.LEFT) {
            this.setState({left_category: id})
        } else {
            this.setState({right_category: id})
        }
    }

    handleSubjectClick(id, side) {
        if (side === this.LEFT) {
            this.setState({left_subject: id})
        } else {
            this.setState({right_subject: id})
        }

    }
    reset(){
        this.setState({
            left_category: null,
            right_category: null,
            left_subject: null,
            right_subject: null
        })
    }

    getOptions(side) {
        const category = (side === this.LEFT ? this.state.left_category : this.state.right_category)
        if (category === null) {
            return this.state.categories;
        }
        return this.state.subjects.filter(s => {
            return s.category === category
        });
    }

    renderOptions(options, side) {
        const prefix = (side === this.LEFT ? "left" : "");
        const cat = (side === this.LEFT ? this.state.left_category : this.state.right_category);
        return options.map(c => (
            <div className="icon" key={prefix + c.id} onClick={() => cat ? this.handleSubjectClick(c.id, side) : this.handleCategoryClick(c.id, side)}>
                <Icon
                file={c.img}
                name={c.name}/>
            </div>
        ));
    }

    renderOutput() {
        if (!this.state.left_subject || !this.state.right_subject) {
            return
        }
        console.log(this.state.subjects)
        console.log(this.state.categories)

        const left = this.state.subjects.find(s=> this.state.left_subject === s.id)
        const right = this.state.subjects.find(s=> this.state.right_subject === s.id)
        const left_cat = this.state.categories.find(c => c.id === left.category)
        const right_cat = this.state.categories.find(c => c.id === right.category)

        const left_factor = (() => {
            if (left_cat.name === right_cat.name) {
                return Math.max( (right.impact_units/left.impact_units).toFixed(2), .01)
            } else {
                return Math.max( (left.impact_units/right.impact_units).toFixed(2), .01)
            }
        })();

        const right_factor = Math.max((1/left_factor).toFixed(2), .01);

        return (
            <div>
                <ul>
                    <li>One {left_cat.units} of {left.name} is equal to {left_factor} {right_cat.units} of {right.name}</li>
                    <li>One {right_cat.units} of {right.name} is equal to {right_factor} {left_cat.units} of {left.name}</li>
                </ul>
            </div>
        )

    }

    render() {
        const left_option_list = this.getOptions(this.LEFT)
        const right_option_list = this.getOptions(this.RIGHT);

        // console.log(left_option_list)

        const left_options = this.renderOptions(left_option_list, this.LEFT);
        const right_options = this.renderOptions(right_option_list, this.RIGHT);
        const output = this.renderOutput();

        return (
            <div id="comparison">
                <div id="select-left" className="select-area">
                    {left_options}
                </div>
                <div id="select-separator">
                    <h3 id="vs">VS</h3>
                </div>
                <div id="select-right" className="select-area">
                    {right_options}
                </div>
                <div id="output">
                    {output}
                </div>
                <div className="reset" onClick={() => this.reset()}>Reset</div>
            </div>
        );
    }
}


// ========================================

ReactDOM.render(
    <Grid />,
    document.getElementById('root')
);
