const outputReducer = (state = [], action) => {
    switch (action.type) {
        case 'UPDATE_OUTPUT':
            return action.payload;
        default:
            return state;
    }
}

export default outputReducer;