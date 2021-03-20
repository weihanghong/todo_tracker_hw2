// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Close from '@material-ui/icons/Close';

class ToDoItem extends Component {
    constructor(props) {
        super(props);
        
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " constructor");
    }

    componentDidMount = () => {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem " + this.props.toDoListItem.id + " did mount");
    }

    handleMoveUp = () => {
        this.props.moveUpCallback(this.props.toDoListItem);
    }

    handleMoveDown = () => {
        this.props.moveDownCallback(this.props.toDoListItem);
    }

    handleClose = () => {
        this.props.removeItemCallback(this.props.toDoListItem);
    }

    changeColor = () => {
        let color = document.getElementById("status-" + this.props.toDoListItem.id);
        if(color.className==="status-complete"){
            color.className = "status-incomplete";
        } else {
            color.className = "status-complete";
        }
    }


    render() {
        // DISPLAY WHERE WE ARE
        console.log("\t\t\tToDoItem render");
        let listItem = this.props.toDoListItem;
        let statusType = "status-complete";
        if (listItem.status === "incomplete")
            statusType = "status-incomplete";

        return (
            <div id={'todo-list-item-' + listItem.id} className='list-item-card'>
                <div className='item-col task-col'><textarea type='text' placeholder={listItem.description}></textarea></div>
                <div className='item-col due-date-col'><input type='date' placeholder={listItem.due_date}></input></div>
                <div className='item-col status-col'>
                    <select id={'status-' + listItem.id} className={statusType} onChange={this.changeColor}>
                        <option hidden selected>{listItem.status}</option>
                        <option>incomplete</option>
                        <option>complete</option>
                    </select>
                </div>
                <div className='item-col test-4-col'></div>
                <div className='item-col list-controls-col'>
                    <KeyboardArrowUp className='list-item-control todo-button' onClick={this.handleMoveUp}/>
                    <KeyboardArrowDown className='list-item-control todo-button' onClick={this.handleMoveDown}/>
                    <Close className='list-item-control todo-button' onClick={this.handleClose}/>
                    <div className='list-item-control'></div>
        <div className='list-item-control'></div>
                </div>
            </div>
        )
    }
}

export default ToDoItem;