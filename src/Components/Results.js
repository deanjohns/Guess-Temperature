import React from 'react';
import '../Styles/results.css';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const Results = ({ output }) => {
    return (
        <div className="results-main">
            {
                output && output.length > 0 && output.map((res, i) => {
                    return (
                        <div key={i} className={`results-block ${res.passed ? 'success-color' : 'failed-color'}`}>
                            <div className="results-block-guess">{res && res.guess}</div>
                            <div className="results-block-was">was {res && res.real}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}

function mapStateToProps(state) {
    return {
        output: state.output
    };
}

export default compose(connect(mapStateToProps))(Results);