import React, { Component } from 'react'
import { Form, Button } from 'semantic-ui-react'
import noPhotoMale from '../images/noPhotoMale.jpg'
import noPhotoFemale from '../images/noPhotoFemale.jpg'
import locale from '../locale/es.json'

const newAthleteFrom = ''

const genderOptions = [
    {text: locale.menLabel, value: 'Men'},
    {text: locale.womenLabel, value: 'Women'}
]

const ageOptions = [
    {text: '(18-35)', value: '(18-35)'},
    {text: '(Master +35)', value: '(Master +35)'},
    {text: '(Teens)', value: '(Teens)'}
]


export default class AddAthleteForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            athlete : {
                name: '',
                gender: '',
                age: '',
                category: 'Rx',
                from: newAthleteFrom,
                photo: '',
                scores: [] //wodId, score
            },
            photoPreview: noPhotoMale
        }
    }

    handleChange = (e, { name, value }) => {
        let athlete = this.state.athlete
        athlete[name] = value
        let photoPreview = this.state.photoPreview
        if (name === 'photo' || (name === 'gender' && athlete['photo'] === '')) {
            photoPreview = this.getPhotoPreview(name, value)
        }

        this.setState({athlete, photoPreview})
    }

    getPhotoPreview = (name, value) => {
        if (name === 'photo') {
            return value
        } else {
            return (value === 'Women') ? noPhotoFemale : noPhotoMale
        }
    }
    
    addAthlete = (event) => {
        this.props.handleAddAthlete(this.state.athlete)
    }

    onError = (gender) => {
        if (gender !== '') {
            let photoPreview = (gender === 'Women') ? noPhotoFemale : noPhotoMale
            this.setState({photoPreview})
        }
    }

  render() {
    let athlete = this.state.athlete
    return (
        <Form unstackable onSubmit={this.addAthlete} className="athleteForm">
            <img className='iconForm' alt=''
                src={`${this.state.photoPreview}`} 
                onError={() => this.setState({photoPreview: (athlete.gender === 'Women') ?
                     noPhotoFemale : noPhotoMale}) }/>
            {/* Name */}
            <Form.Input label={locale.nameLabel}
            placeholder={locale.namePlaceholder} 
            name='name'
            onChange={this.handleChange}
            autoComplete="off"/>
            {/* Gender */}
            <Form.Select label={locale.genderLabel}
            placeholder={locale.genderPlaceholder}
            name='gender'
            options={genderOptions}
            onChange={this.handleChange}/>
            {/* Age */}
            <Form.Select label={locale.ageLabel}
            placeholder={locale.agePlaceholder}
            name='age'
            options={ageOptions}
            onChange={this.handleChange}/>
            {/* Box */}
            <Form.Input label={locale.boxLabel}
            placeholder={locale.boxPlaceholder} 
            name='from' value={athlete.from} 
            onChange={this.handleChange}/>
            {/* Photo */}
            <Form.Input label={locale.photoLabel}
            placeholder={locale.photoPlaceholder}
            name='photo'
            onChange={this.handleChange}
            autoComplete="off"/>
            {/* Category */}
            <Form.Group inline>
                <Form.Radio
                label={locale.rxLabel}
                name='category'
                value='Rx'
                checked={athlete.category === 'Rx'}
                onChange={this.handleChange}/>
                <Form.Radio
                label={locale.scLabel}
                name='category'
                value='Scaled'
                checked={athlete.category === 'Scaled'}
                onChange={this.handleChange}/>
            </Form.Group>

            <Button type='submit' className='createButton' disabled={athlete.name.length === 0 }>{locale.submitLabel}</Button>
        </Form>
    )
  }
}
