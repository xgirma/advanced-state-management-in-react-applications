import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NewItem from '../components/NewItem';
import { addNewItem } from '../actions/items-actions';
import { updateNewItemValue } from '../actions/new-item-actions';

const mapStateToProps = ({ newItemValue }) => ({ value: newItemValue });

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateNewItemValue,
    addNewItem,
  }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(NewItem);
