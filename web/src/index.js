import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Icon(props) {
    return (
    <div className="icon">
        <img src={"img/"+props.file} alt="Pig" width="100px"/>
        <p>{props.name}</p>
    </div>
    )
}

class Grid extends React.Component {
    constructor() {
        super();
        this.state = {
            categories: [],
            subjects: [],
            left_selection_category: null,
            right_selection_category: null,
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
            console.log(this.state)
          } catch (err) {
            console.log('Fetch Error :-S', err);
          }
    }

    async componentDidMount() {
        await this.fetch_and_load("http://localhost:5000/api/categories", "categories")
        await this.fetch_and_load("http://localhost:5000/api/subjects", "subjects")
    }

    handleCategoryClick(id) {
        this.setState({left_selection_category: id})
    }

    handleSubjectClick() {

    }
    reset(){
        this.setState({left_selection_category: null})
    }

    render() {
        const left_options = (() => {
            if (this.state.left_selection_category === null) {
                return this.state.categories;
            }
            return this.state.subjects.filter(s => {
                return s.category === this.state.left_selection_category
            });
        })();
        console.log(left_options)
        return (
            <div>
                {left_options.map(c => (
                    <div className="icon" key={c.id} onClick={() => this.state.left_selection_category ? this.handleSubjectClick(c.name) : this.handleCategoryClick(c.id)}>
                        <Icon
                        file={c.img}
                        name={c.name}/>
                    </div>
                ))}
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
