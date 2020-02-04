import React, { Component } from 'react'
import { Form } from 'semantic-ui-react';
import filterIcon from '../images/filterIcon.jpg'

const genderOptions = [
    {text: 'All', value: 'All'},
    {text: 'Men', value: 'Men'},
    {text: 'Women', value: 'Women'}
]

const ageOptions = [
    {text: 'All', value: 'All'},
    {text: '(18-35)', value: '(18-35)'},
    {text: '(Master +35)', value: '(Master +35)'},
    {text: '(Teens)', value: '(Teens)'}
]

export default class FilterForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            filter: {
                gender: this.props.filter.gender,
                age: this.props.filter.age,
                category: this.props.active && this.props.filter.category === 'All' ? 'Rx' : this.props.filter.category
            }
        }
    }

    categoryOptions = this.props.active ? 
        [{text: 'Rx', value: 'Rx'}, {text: 'Scaled', value: 'Scaled'}] : 
        [{text: 'All', value: 'All'}, {text: 'Rx', value: 'Rx'}, {text: 'Scaled', value: 'Scaled'}]

    // componentWillReceiveProps(nextProps) {
    //     this.setState({ 
    //         gender: nextProps.filter.gender,
    //         age: nextProps.filter.age,
    //         category: nextProps.filter.category
    //     })
    // }

    // static getDerivedStateFromProps = (nextProps, prevState) => {
    //     if(JSON.stringify(nextProps.filter) !== JSON.stringify(prevState.filter)) {
    //       return { filter: nextProps.filter};
    //    }
    //    else return null;
    //  }
     

    handleChange = (e, { name, value }) => {
        let filter = this.state.filter
        if (filter[name] !== value) {
            filter[name] = value
            this.props.handleFilter(filter)
        }
    }

    render() {

        return (
            <Form unstackable className="filterForm">
                <img className='iconForm' alt='' src={filterIcon}/>
                {/* Gender */}
                <Form.Select label='Gender'
                name='gender'
                value={this.state.filter.gender}
                options={genderOptions}
                onChange={this.handleChange}/>
                {/* Age */}
                <Form.Select label='Age'
                name='age'
                value={this.state.filter.age}
                options={ageOptions}
                onChange={this.handleChange}/>
                {/* Category */}
                <Form.Select label='Category'
                name='category'
                value={this.state.filter.category}
                options={this.categoryOptions}
                onChange={this.handleChange}/>
            </Form>
        )
    }
}
