import React, { Component } from "react"
import ReactDOM from "react-dom"

/*

Challenge:
1. Convert all 3 components to be class-based
2. Fix the small bug

*/

// #1

class App extends Component {

    render() {
        return (
            <div>
                <Header username="Myles" />
                <Greeting />
            </div>
        )
    }
}

class Header extends Component {
    render() {
        return (
         <header> /
            <p>Welcome, {this.props.username}!</p>
         </header>
        )
    }   
}

class Greeting extends Component {

    date = new Date()
    hours = this.date.getHours()
    timeOfDay = this.hours < 12 ? "morning" : this.hours >= 12 && this.hours < 17 ? "afternoon" : "night"

    render() {
        return (
            <h1>Good {this.timeOfDay} to you, sir or madam!</h1>
        )
    }
}



ReactDOM.render(<App />, document.getElementById("root"))
