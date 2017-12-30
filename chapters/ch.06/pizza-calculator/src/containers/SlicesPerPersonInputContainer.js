import { connect } from 'react-redux';

import Input from '../components/Input';
import { updateSlicesPerPerson } from '../actions';

const mapStateToProps = ({ slicesPerPerson }) => ({
  label: 'Slices per person',
  value: slicesPerPerson,
  type: 'number',
  min: 0,
});

const mapDispatchToProps = (dispatch) => {
  return {
    onChange(value) {
      dispatch(updateSlicesPerPerson(value))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Input)