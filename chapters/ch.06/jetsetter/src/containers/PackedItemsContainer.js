import { connect } from 'react-redux';
import Items from '../components/Items';

import { removeItem, toggleItem } from "../actions/items-actions";

const mapStateToProps = ({ items, filter}) => {
  return { items: items.filter(item => item.packed && item.value.includes(filter.packedItemsFilter)) };
};

const mapDispatchToProps = dispatch => ({
  onCheckOff(id) {
    dispatch(toggleItem(id));
  },
  onRemove(id) {
    dispatch(removeItem(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Items);