// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import testData from './test/testData.json'
import jsTPS from './common/jsTPS'

// THESE ARE OUR REACT COMPONENTS
import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import Workspace from './components/Workspace'
import ToDoItem from './components/ToDoItem'
import ItemsListHeaderComponent from './components/ItemsListHeaderComponent'
import ItemsListComponent from './components/ItemsListComponent'
import ListsComponent from './components/ListsComponent'

class App extends Component {
  constructor(props) {
    // ALWAYS DO THIS FIRST
    super(props);

    // DISPLAY WHERE WE ARE
    console.log("App constructor");

    // MAKE OUR TRANSACTION PROCESSING SYSTEM
    this.tps = new jsTPS();

    // CHECK TO SEE IF THERE IS DATA IN LOCAL STORAGE FOR THIS APP
    let recentLists = localStorage.getItem("recentLists");
    console.log("recentLists: " + recentLists);
    if (!recentLists) {
      recentLists = JSON.stringify(testData.toDoLists);
      localStorage.setItem("toDoLists", recentLists);
    }
    recentLists = JSON.parse(recentLists);

    // FIND OUT WHAT THE HIGHEST ID NUMBERS ARE FOR LISTS
    let highListId = -1;
    let highListItemId = -1;
    for (let i = 0; i < recentLists.length; i++) {
      let toDoList = recentLists[i];
      if (toDoList.id > highListId) {
        highListId = toDoList.id;
      }
      for (let j = 0; j < toDoList.items.length; j++) {
        let toDoListItem = toDoList.items[j];
        if (toDoListItem.id > highListItemId)
        highListItemId = toDoListItem.id;
      }
    };

    // SETUP OUR APP STATE
    this.state = {
      toDoLists: recentLists,
      currentList: {items: []},
      nextListId: highListId+1,
      nextListItemId: highListItemId+1,
      useVerboseFeedback: true
    }
  }

  // WILL LOAD THE SELECTED LIST
  loadToDoList = (toDoList) => {
    console.log("loading " + toDoList);

    // MAKE SURE toDoList IS AT THE TOP OF THE STACK BY REMOVING THEN PREPENDING
    const nextLists = this.state.toDoLists.filter(testList =>
      testList.id !== toDoList.id
    );
    nextLists.unshift(toDoList);

    this.setState({
      toDoLists: nextLists,
      currentList: toDoList
    });
  }

  addNewList = () => {
    let newToDoListInList = [this.makeNewToDoList()];
    let newToDoListsList = [...newToDoListInList, ...this.state.toDoLists];
    let newToDoList = newToDoListInList[0];

    // AND SET THE STATE, WHICH SHOULD FORCE A render
    this.setState({
      toDoLists: newToDoListsList,
      currentList: newToDoList,
      nextListId: this.state.nextListId+1
    }, this.afterToDoListsChangeComplete);
  }

  addItem = () => {
    let newItem = this.makeNewToDoListItem();
    let newItemList = this.state.currentList;
    newItemList.items.push(newItem);
    let newItemListList = this.state.toDoLists;
    newItemListList.splice(0, 1, newItemList);
    this.setState ({
      toDoLists:newItemListList,
      currentList: newItemList,
      nextListItemId: this.state.nextListItemId+1
    }, this.afterToDoListsChangeComplete);
  }

  makeNewToDoList = () => {
    let newToDoList = {
      id: this.state.nextListId,
      name: 'Untitled',
      items: []
    };
    return newToDoList;
  }

  makeNewToDoListItem = () =>  {
    let newToDoListItem = {
      description: "No Description",
      dueDate: "none",
      status: "incomplete"
    };
    return newToDoListItem;
  }

  // THIS IS A CALLBACK FUNCTION FOR AFTER AN EDIT TO A LIST
  afterToDoListsChangeComplete = () => {
    console.log("App updated currentToDoList: " + this.state.currentList);

    // WILL THIS WORK? @todo
    let toDoListsString = JSON.stringify(this.state.toDoLists);
    localStorage.setItem("recent_work", toDoListsString);
  }

  //deleting function for now, can't open modal
  openModal = () => {
    let newListList = [];
    let oldListList = this.state.toDoLists;
    for(let i = 1; i<oldListList.length; i++){
    newListList.push(oldListList[i]);
    }
    this.setState ({
      toDoLists: newListList,
      currentList: {items: []}
    }, this.afterToDoListsChangeComplete);
  }

  closeList = () => {
    this.setState ({
      currentList: {items: []}
    });
  }

  moveUp = (toDoListItem) => {
    let oldList = this.state.currentList.items;
    let newList = [];
    let x = 0;
    if(oldList[0]!==toDoListItem){
      for(let i = x+1; i<oldList.length; i++){
        if(oldList[i]===toDoListItem){
          break;
        }
        newList.push(oldList[x]);
        x++;
      }
      newList.push(toDoListItem);
      newList.push(oldList[x]);
      for(let i = x+2; i<oldList.length; i++){
        newList.push(oldList[i]);
      }
      let newCurrent = this.state.currentList;
      newCurrent.items = newList;
      this.setState({
        currentList: newCurrent
      });
    }
  }

  moveDown = (toDoListItem) => {
    let oldList = this.state.currentList.items;
    let newList = [];
    let x = 0;
    if(oldList[oldList.length-1]!==toDoListItem){
      for(let i = x; i<oldList.length; i++){
        x++;
        if(oldList[i]===toDoListItem){
          break;
        }
        newList.push(oldList[i]);
      }
      newList.push(oldList[x]);
      newList.push(toDoListItem);
      for(let i = x+1; i<oldList.length; i++){
        newList.push(oldList[i]);
      }
      let newCurrent = this.state.currentList;
      newCurrent.items = newList;
      this.setState({
        currentList: newCurrent
      });
    }
  }

  removeItem = (toDoListItem) => {
    
  }

  changeName = (toDoList) => {
    toDoList.name = <textarea type='text' placeholder={toDoList.name}></textarea>;
    
  }

  render() {
    let items = this.state.currentList.items;
    return (
      <div id="root">
        <Navbar />
        <LeftSidebar 
          toDoLists={this.state.toDoLists}
          loadToDoListCallback={this.loadToDoList}
          addNewListCallback={this.addNewList}
          changeNameCallback={this.changeName}
        />
        <Workspace toDoListItems={items} 
          addItemCallback={this.addItem}
          confirmDeleteCallback={this.openModal}
          closeListCallback={this.closeList}
          moveUpCallback={this.moveUp}
          moveDownCallback={this.moveDown}
          removeItemCallback={this.removeItem}
        />
        
      </div>
    );
  }
}

export default App;