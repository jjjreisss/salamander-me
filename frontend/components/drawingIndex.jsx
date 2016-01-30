var React = require('react');
var DrawingStore = require('../stores/drawingStore');
var DrawingComparatorStore = require('../stores/drawingComparatorStore');
var ApiUtil = require('../util/apiUtil');
var DrawingListItem = require('./drawingListItem');
var drawingIndexTour = require('../util/drawingIndexTour');
var ApiActions = require('../actions/apiActions');
var DrawingComparatorActions = require('../actions/drawingComparatorActions');

var DrawingIndex = React.createClass({
  getInitialState: function() {
    return({
      drawings: null,
      selectedTab: "popularity",
      comparator:
        function(a, b) {
          if (a.likes.length < b.likes.length) {
            return 1;
          } else if (a.likes.length === b.likes.length) {
            return 0;
          } else {
            return -1;
          }
        },
      drawingsList: null
    });
  },
  componentDidMount: function() {
    // this.drawingStoreListener = DrawingStore.addListener(this._onDrawingStoreChange);
    // this.drawingComparatorStoreListener = DrawingComparatorStore.addListener(this._onComparatorStoreChange);
    this.drawingStoreListener = DrawingStore.addListener(this._onChange);
    // this.drawingComparatorStoreListener = DrawingComparatorStore.addListener(this._onChange);
    DrawingComparatorActions.receiveDrawingComparator(this.popularityComparator);
    ApiUtil.fetchAllDrawings();
    if (window.wholeDamnTour.currentStep && window.wholeDamnTour.currentStep.id === "save-drawing") {
      window.setTimeout(function() {
        window.wholeDamnTour.next();
      }, 200);
    };
  },
  componentWillUnmount: function() {
    this.drawingStoreListener.remove();
  },
  // _onDrawingStoreChange: function() {
  //   this.setState({drawings: DrawingStore.all().reverse()});
  //   this.setDrawingsList();
  // },
  // _onComparatorStoreChange: function() {
  //   this.setState({comparator: DrawingComparatorStore.comparator()})
  //   this.setDrawingsList();
  // },
  _onChange: function() {
    this.setState({
      drawings: DrawingStore.all().reverse(),
      comparator: DrawingComparatorStore.comparator()
    })
    this.setDrawingsList();
  },
  sortByNewness: function() {
    DrawingComparatorActions.receiveDrawingComparator(this.newnessComparator);
    ApiUtil.fetchAllDrawings();
    this.setState({
      // comparator: this.popularityComparator,
      selectedTab: "newness"
    });
  },
  sortByPopularity: function(e) {
    DrawingComparatorActions.receiveDrawingComparator(this.popularityComparator);
    ApiUtil.fetchAllDrawings()
    this.setState({
    //   comparator: this.popularityComparator,
      selectedTab: "popularity"
    });
    // this.setDrawingsList();
  },

  setDrawingsList: function() {
    var sortedDrawings = this.state.drawings.sort(this.state.comparator);
    drawingsList = sortedDrawings.map(function(drawing, idx){
      return (
        <DrawingListItem
          key={idx}
          drawing={drawing}/>
      );
    });
    this.setState({drawingsList: drawingsList})
  },

  popularityComparator: function(a, b) {
    if (a.likes.length < b.likes.length) {
      return 1;
    } else if (a.likes.length === b.likes.length) {
      return 0;
    } else {
      return -1;
    }
  },

  newnessComparator: function(a, b) {
    if (a.created_at < b.created_at) {
      return 1;
    } else if (a.created_at === b.created_at) {
      return 0;
    } else {
      return -1;
    }
  },

  render: function() {
    var popularitySelected =
      this.state.selectedTab === "popularity" ? "selected-tab" : "";
    var newnessSelected =
      this.state.selectedTab === "newness" ? "selected-tab" : "";

    // if (this.state.drawingsList == null && this.state.drawings) {
    //   var sortedDrawings = this.state.drawings.sort(this.state.comparator);
    //   drawingsList = sortedDrawings.map(function(drawing, idx){
    //     return (
    //       <DrawingListItem
    //         key={idx}
    //         drawing={drawing}/>
    //     );
    //   });
    // } else {
    //   drawingsList = this.state.drawingsList
    // }

    return(
      <div className="index">
        <h1 className="index-header">
          <span
            className="index-tab"
            onClick={this.sortByPopularity}
            id={popularitySelected}>
            <span>
              Most Popular Drawings
            </span>
          </span>
          <span
            className="index-tab"
            onClick={this.sortByNewness}
            id={newnessSelected}>
            <span>
              Newest Drawings
            </span>
          </span>
        </h1>
          <div className="index-contents">
            {this.state.drawingsList}
          </div>
      </div>
    );
  }

});

module.exports = DrawingIndex;
