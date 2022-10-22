import Nav from '../components/Nav'
import {useState, useEffect} from 'react'
import {Cookies, useCookies} from 'react-cookie'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        gender_identity: "",
        gender_interest: "",
        url: "",
        about: ""
    })
    
    const setVal = (name, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/user', {
                params: {username: cookies.Username}
            })
            const user = response.data.user
            if(formData.first_name === "") setVal("first_name",user.first_name)
            if(formData.last_name === "") setVal("last_name",user.last_name)
            if(formData.dob_day === "") setVal("dob_day",user.dob_day)
            if(formData.dob_month === "") setVal("dob_month",user.dob_month)
            if(formData.dob_year === "") setVal("dob_year",user.dob_year)
            if(formData.gender_identity === "") setVal("gender_identity",user.gender_identity)
            if(formData.gender_interest === "") setVal("gender_interest",user.gender_interest)
            if(formData.url === "") setVal("url",user.url)
            if(formData.about === "") setVal("about",user.about)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()
    }, [])
    const AuthToken = cookies.AuthToken
    const [submitText, setSubmitText] = useState("Submit")

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        console.log('submitted')
        e.preventDefault()
        setSubmitText("Submitting")
        try {
            console.log(cookies.Username)
            const response = await axios.put('http://localhost:8000/user', { formData, username: cookies.Username }, 
                {headers: {"Authorization" : `Bearer ${AuthToken}`}})
            console.log(response)
            const success = response.status === 200
            if (success) navigate('/dashboard')
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        console.log('e', e)
        const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
        const name = e.target.name

        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }


    return (
        <>
            <Nav
                minimal={true}
                setShowModal={() => {
                }}
                showModal={false}
            />

            <div className="profile">
                <h2>CREATE ACCOUNT</h2>

                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            type='text'
                            name="first_name"
                            placeholder="First Name"
                            required={true}
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            id="last_name"
                            type='text'
                            name="last_name"
                            placeholder="Last Name"
                            required={true}
                            value={formData.last_name}
                            onChange={handleChange}
                        />

                        <label>Birthday</label>
                        <div className="multiple-input-container">
                            <input
                                id="dob_day"
                                type="number"
                                name="dob_day"
                                placeholder="DD"
                                required={true}
                                value={formData.dob_day}
                                onChange={handleChange}
                            />

                            <input
                                id="dob_month"
                                type="number"
                                name="dob_month"
                                placeholder="MM"
                                required={true}
                                value={formData.dob_month}
                                onChange={handleChange}
                            />

                            <input
                                id="dob_year"
                                type="number"
                                name="dob_year"
                                placeholder="YYYY"
                                required={true}
                                value={formData.dob_year}
                                onChange={handleChange}
                            />
                        </div>

                        <label>Gender</label>
                        <div className="multiple-input-container">
                            <input
                                id="man-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_identity === "man"}
                            />
                            <label htmlFor="man-gender-identity">Man</label>
                            <input
                                id="woman-gender-identity"
                                type="radio"
                                name="gender_identity"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_identity === "woman"}
                            />
                            <label htmlFor="woman-gender-identity">Woman</label>
                        </div>

                        <label>Show Me</label>

                        <div className="multiple-input-container">
                            <input
                                id="man-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="man"
                                onChange={handleChange}
                                checked={formData.gender_interest === "man"}
                            />
                            <label htmlFor="man-gender-interest">Man</label>
                            <input
                                id="woman-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="woman"
                                onChange={handleChange}
                                checked={formData.gender_interest === "woman"}
                            />
                            <label htmlFor="woman-gender-interest">Woman</label>
                            <input
                                id="everyone-gender-interest"
                                type="radio"
                                name="gender_interest"
                                value="everyone"
                                onChange={handleChange}
                                checked={formData.gender_interest === "everyone"}
                            />
                            <label htmlFor="everyone-gender-interest">Everyone</label>

                        </div>

                        <label htmlFor="about">About me</label>
                        <input
                            id="about"
                            type="text"
                            name="about"
                            required={true}
                            placeholder="I like long walks..."
                            value={formData.about}
                            onChange={handleChange}
                        />

                        <input type="submit" value={submitText}/>
                    </section>

                    <section>

                        <label htmlFor="url">Profile Photo URL</label>
                        <input
                            type="url"
                            name="url"
                            id="url"
                            value={formData.url}
                            onChange={handleChange}
                            required={true}
                        />
                        <div className="photo-container">
                            {formData.url && <img src={formData.url} alt="profile pic preview"/>}
                        </div>


                    </section>

                </form>
            </div>
        </>
    )
}
export default Profile
