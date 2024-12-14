import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateSpotForm.module.css';

const CreateSpotForm = () => {
  const navigate = useNavigate();

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
  //! Refactor: use the csrfFetch function from csrf.js in the Redux store to fetch csrf token 
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetch('/api/csrf/restore');
      const data = await response.json();
      setCsrfToken(data['XSRF-Token']);
    };

    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('image')) {
      const index = parseInt(name.split('-')[1], 10);
      const newImageUrls = [...formData.imageUrls];
      newImageUrls[index] = value;
      setFormData((prevState) => ({
        ...prevState,
        imageUrls: newImageUrls,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { address, city, state, country, lat, lng, name, description, price, imageUrls } = formData;

    // Improved URL regex pattern
    const urlRegex = /^(https?:\/\/(?:www\.)?[^\s/.?#].[^\s]*)$/i;

    if (!address) newErrors.address = "Street Address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!country) newErrors.country = "Country is required";
    if (!lat || isNaN(lat) || lat < -90 || lat > 90) newErrors.lat = "Latitude must be between -90 and 90";
    if (!lng || isNaN(lng) || lng < -180 || lng > 180) newErrors.lng = "Longitude must be between -180 and 180";
    if (!name) newErrors.name = "Name of your spot is required";
    if (!description || description.length < 30) newErrors.description = "Description needs 30 or more characters";
    if (!price || isNaN(price)) newErrors.price = "Price per night is required";
    if (!imageUrls[0]) {
      newErrors.image0 = "Preview Image URL is required";
    } else if (!urlRegex.test(imageUrls[0])) {
      newErrors.image0 = "Preview Image URL must be a valid URL";
    }

    // Validate other image URLs
    for (let i = 1; i < imageUrls.length; i++) {
      if (imageUrls[i] && !urlRegex.test(imageUrls[i])) {
        newErrors[`image${i}`] = `Image URL ${i + 1} must be a valid URL`;
      }
    }

    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { address, city, state, country, lat, lng, name, description, price, imageUrls } = formData;

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

    try {
      const response = await fetch('/api/spots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(newSpot),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors(data.errors ? data.errors : { general: "Something went wrong" });
        return;
      }

      const spot = await response.json();

      // Now, let's add the images to the spot
      for (let i = 0; i < imageUrls.length; i++) {
        if (imageUrls[i]) {
          const image = {
            url: imageUrls[i],
            preview: i === 0, // set the first image as the preview image
          };

          const imageResponse = await fetch(`/api/spots/${spot.id}/images`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(image),
          });

          if (!imageResponse.ok) {
            console.error(`Error adding image ${i + 1}:`, await imageResponse.json());
            // Optionally, handle the error
          }
        }
      }

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
            {idx === 0 ? "Preview Image URL" : "Image URL"}
            <input type="text" name={`image-${idx}`} value={url} onChange={handleChange} placeholder={idx === 0 ? "Preview Image URL" : "Image URL"} />
            {errors[`image${idx}`] && <p className={styles.error}>{errors[`image${idx}`]}</p>}
          </label>
        ))}
        <button type="submit">Create Spot</button>
      </form>
    </div>
  )
};

export default CreateSpotForm;
