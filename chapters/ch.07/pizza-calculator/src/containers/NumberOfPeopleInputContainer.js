import { connect } from 'react-redux';

import { Input } from '../components/Input';

import { updateNumberOfPeople } from '../actions'

const mapStateToProps = (state) => {
  return {
    value: state.numberOfPeople
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange(value){
      updateNumberOfPeople(value);
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Input)