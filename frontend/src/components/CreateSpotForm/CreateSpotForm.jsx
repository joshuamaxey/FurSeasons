import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateSpotForm.module.css';

const CreateSpotForm = () => {
  const navigate = useNavigate(); // we will use navigate to navigate to different URLs.

  // Here we create a form with the inputs necessary to create a spot
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    lat: '',
    lng: '',
    name: '',
    description: '',
    price: '',
    imageUrls: ['', '', '', '', ''],
  });
  const [errors, setErrors] = useState({});
  const [csrfToken, setCsrfToken] = useState('');

  // First, fetch CSRF token.
  useEffect(() => {
    // Fetch CSRF token from server
    const fetchCsrfToken = async () => {
      const response = await fetch('/api/csrf/restore');
      const data = await response.json();
      setCsrfToken(data['XSRF-Token']);
    };

    fetchCsrfToken();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target; // destructure the name and value properties from the event target (the element that triggered the change event)
    if (name.startsWith('image')) { // Here we check to see if the change event is for one of the image URL inputs
      const index = parseInt(name.split('-')[1], 10); // If so, split the name string by "-" and parse the second part as an integer to get the index of the image URL array. (in other words, image-0 will become 0, and so on)
      const newImageUrls = [...formData.imageUrls]; // Create a copy of the current imageUrls array from the formData state
      newImageUrls[index] = value; // Updates the specific index in the copied imageUrls array with the new value from the input.
      setFormData((prevState) => ({ // update the formData state with the new imageUrls while preserving the other form data
        ...prevState,
        imageUrls: newImageUrls,
      }));
    } else { // Otherwise if the name doesn't start with 'image,' update formData state directly using the input name as the key and setting its value in the formData state while rpeserving the other form data.
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  //^ Basically, the handlechange watches for when a user types into an input field. When the handleChange function is triggered by the event (e), the function determines whether the input is a general field or an image URL. Then it updates the formData state with the new input value. THis makes sure that the form's state is always in sync with the user's inputs. 

  // To solve validation issues, here we create a new validateForm function to manually validate all of the fields required to create a new Spot
  const validateForm = () => {
    const newErrors = {};
    const { address, city, state, country, lat, lng, name, description, price, imageUrls } = formData;

    if (!address) newErrors.address = "Street Address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!country) newErrors.country = "Country is required";
    if (!lat || isNaN(lat) || lat < -90 || lat > 90) newErrors.lat = "Latitude must be between -90 and 90";
    if (!lng || isNaN(lng) || lng < -180 || lng > 180) newErrors.lng = "Longitude must be between -180 and 180";
    if (!name) newErrors.name = "Name of your spot is required";
    if (!description || description.length < 30) newErrors.description = "Description needs 30 or more characters";
    if (!price || isNaN(price)) newErrors.price = "Price per night is required";
    if (!imageUrls[0]) newErrors.image0 = "Preview Image URL is required";

    return newErrors;
  };

  // Check if there are any errors before submitting. If so, do not submit the form to create a new spot.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { address, city, state, country, lat, lng, name, description, price } = formData;

    const newSpot = {
      address,
      city,
      state,
      country,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name,
      description,
      price: parseFloat(price),
    };

    // Send a POST requrest to the backend url to create a new Spot in the database
    try {
      const response = await fetch('/api/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(newSpot),
      });

      // If the request is not successful, set the relevant errors for display on the form and then return here to stop code execution
      if (!response.ok) {
        const data = await response.json();
        setErrors(data.errors ? data.errors : { general: "Something went wrong" });
        return;
      }

      // set 'spot' equal to the spot that is returned by the backend route to create a new spot. Then navigate to the spot's spotDetails page using the spot'd id. If there are any errors, show them in the console.
      const spot = await response.json();
      navigate(`/spots/${spot.id}`);
    } catch (error) {
      setErrors({ general: error.message });
      console.error('Error creating spot:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        {errors.general && <p className={styles.error}>{errors.general}</p>}
        <h2>Where&apos;s your place located?</h2>
        <h4>Guests will only get your exact address once they book a reservation.</h4>
        <label>
          Country
          <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder='Country'/>
          {errors.country && <p className={styles.error}>{errors.country}</p>}
        </label>
        <label>
          Street Address
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder='Street Address'/>
          {errors.address && <p className={styles.error}>{errors.address}</p>}
        </label>
        <label>
          City
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder='City'/>
          {errors.city && <p className={styles.error}>{errors.city}</p>}
        </label>
        <label>
          State
          <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder='State'/>
          {errors.state && <p className={styles.error}>{errors.state}</p>}
        </label>
        <label>
          Latitude
          <input type="text" name="lat" value={formData.lat} onChange={handleChange} placeholder='Must be between -90 and 90'/>
          {errors.lat && <p className={styles.error}>{errors.lat}</p>}
        </label>
        <label>
          Longitude
          <input type="text" name="lng" value={formData.lng} onChange={handleChange} placeholder='Must be between -180 and 180'/>
          {errors.lng && <p className={styles.error}>{errors.lng}</p>}
        </label>
        <hr></hr>
        <h2>Describe your place to guests</h2>
        <h4>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</h4>
        <label>
          <textarea name="description" value={formData.description} onChange={handleChange} required minLength="30" placeholder='Please write at least 30 characters'/>
          {errors.description && <p className={styles.error}>{errors.description}</p>}
        </label>
        <hr></hr>
        <h2>Create a title for your spot</h2>
        <h4>Catch guests&apos; attention with a spot title that highlights what makes your place special.</h4>
        <label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required maxLength="50" placeholder='Name of your spot'/>
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </label>
        <hr></hr>
        <h2>Set a base price for your spot</h2>
        <h4>Competitive pricing can help your listing stand out and rank higher in search results.</h4>
        <label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" placeholder="Price per night (USD)" />
          {errors.price && <p className={styles.error}>{errors.price}</p>}
        </label>
        <hr></hr>
        <h2>Liven up your spot with photos</h2>
        <h4>Submit a link to at least one photo to publish your spot.</h4>
        {formData.imageUrls.map((url, idx) => (
          <label key={idx}>
            {idx === 0 ? "Preview Image URL" : "Image URL"} (optional)
            <input type="text" name={`image-${idx}`} value={url} onChange={handleChange} placeholder={idx === 0 ? "Preview Image URL" : "Image URL"} />
            {errors[`image${idx}`] && <p className={styles.error}>{errors[`image${idx}`]}</p>}
          </label>
        ))}
        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpotForm;
