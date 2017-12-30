import React, { Component } from 'react';

import MarkAllAsUnpackedContainer from '../containers/MarkAllAsUnpackedContainer';
import NewItemContainer from '../containers/NewItemContainer';
import PackedFilterContainer from '../containers/PackedFilterContainer';
import PackedItemsContainer from '../containers/PackedItemsContainer';
import UnpackedFilterContainer from '../containers/UnpackedFilterContainer';
import UnpackedItemsContainer from '../containers/UnpackedItemsContainer';

import './Application.css';

class Application extends Component {
  render() {
    return (
      <div className="Application">
        <NewItemContainer />
        <UnpackedItemsContainer title="Unpacked Items" render={() => <UnpackedFilterContainer />} />
        <PackedItemsContainer title="Packed Items" render={() => <PackedFilterContainer />} />
        <MarkAllAsUnpackedContainer />
      </div>
    );
  }
}

export default Application;
