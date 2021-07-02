import CITIES from './Cities';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import '../Styles/searchcomponent.css';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { updateOutput } from '../Store/actions';

const APIkey = "dba163026ff4b0c82f5554f8c314b615";
var passes = 0;

class SearchComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            temperature: 0,
            searchAttempts: 1,
            output: {},
        }
    }

    /**
     * Check the temperature using the openweathermap API
     * @returns object
     */
    checkTemperature = async () => {
        const { searchAttempts, temperature } = this.state;
        if (searchAttempts < 6) {
            const city = CITIES['city' + searchAttempts];
            const URL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIkey}`;
            var output = "";
            await fetch(URL)
                .then(response => { return response.json() })
                .then(data => {
                    output = {
                        city: city,
                        guess: Number(temperature),
                        real: data.main.temp,
                        passed: this.checkPassed(temperature, data.main.temp)
                    };
                })
                .catch(error => {
                    console.log("ERROR: ", error);
                })
        }
        return output;
    }

    /**
     * Assign the current result to the Redux store
     * @returns void
     */
    getData = async () => {
        const { searchAttempts, temperature } = this.state;
        const { updateOutput, output } = this.props;
        if (temperature !== "") {
            this.setState({
                output: await this.checkTemperature(),
                temperature: 0,
                searchAttempts: searchAttempts + 1,
            }, () => { updateOutput([...output, this.state.output]) })
        }
    }

    /**
     * Check if a guessed temperature is passed or failed
     * @param {*} guess 
     * @param {*} real 
     * @returns boolean
     */
    checkPassed = (guess, real) => {
        const upperLimit = real + 5;
        const lowerLimit = real - 5;
        if (Number(guess) >= lowerLimit && Number(guess) <= upperLimit) {
            passes += 1;
            return true;
        }
        return false;
    }

    /**
     * Retry with empty inputs
     * @returns void
     */
    retry = () => {
        const { updateOutput } = this.props;
        passes = 0;
        this.setState({
            temperature: 0,
            searchAttempts: 1,
            output: {},
        }, () => { updateOutput([]) })
    }

    render() {

        const { temperature, searchAttempts } = this.state;

        return (
            <div className="search-main">
                <div className="search-main-box">
                    <div className="search-main-box-inner">
                        {
                            searchAttempts < 6 ?
                                <>
                                    <div className="search-main-box-city">{CITIES['city' + searchAttempts]}</div>
                                    <input
                                        type="number"
                                        id="temperature"
                                        name="temperature"
                                        className="search-main-box-input"
                                        placeholder="Enter your guessed temperature"
                                        value={temperature}
                                        onChange={e => this.setState({ temperature: e.target.value })}
                                    />
                                    <button onClick={this.getData} className="search-main-box-button">Check</button>
                                </>
                                :
                                <div className="search-result-main">
                                    <div className="search-result-text">{passes >= 3 ? "Passed" : "Failed"}</div>
                                    <button onClick={this.retry} className="search-main-box-button">Retry</button>
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        output: state.output
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateOutput: updateOutput
    }, dispatch);
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(SearchComponent);