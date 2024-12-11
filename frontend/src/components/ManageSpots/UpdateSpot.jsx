import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './updateSpotForm.module.css';

// Here we create the form containing the fields necessary to update the spot and set them to empty strings by default
const UpdateSpot = () => {
  const { spotId } = useParams();
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
  const [csrfToken, setCsrfToken] = useState(''); // State for CSRF token

  // Fetch the CSRF token from the server
  useEffect(() => {
    const fetchCsrfToken = async () => {
      const response = await fetch('/api/csrf/restore');
      const data = await response.json();
      setCsrfToken(data['XSRF-Token']);
    };

    fetchCsrfToken();

    // Fetch spot details by spotId
    const fetchSpotDetails = async () => {
      try {
        const response = await fetch(`/api/spots/${spotId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch spot details');
        }
        const data = await response.json();
        // After we fetch the details of the current spot, populate the form with the spot's current data
        setFormData({
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          lat: data.lat,
          lng: data.lng,
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrls: data.SpotImages.map(image => image.url).concat(new Array(5 - data.SpotImages.length).fill('')),
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchSpotDetails();
  }, [spotId]);

  // Handle any changes that occur on the spot form in any of the fields. If the change occurs in one of the fields for an image, update the image field by its index. Otherwise update the field directly
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here we create a variable called updatedSpot with the updated information from the form.
    const { address, city, state, country, lat, lng, name, description, price } = formData;

    const updatedSpot = {
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

    // Then we make a PUT request to the backend route using the spot's spotId in order to update the record for the spot in the database.
    try {
      const response = await fetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // MAKE SURE TO INCLUDE CSRF TOKEN OR THIS WILL NOT WORK.
        },
        body: JSON.stringify(updatedSpot),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors(data.errors ? data.errors : { general: "Something went wrong" });
        return;
      }

      // After we've updated the spot, navigate automatically to that spot's spotDetails page
      navigate(`/spots/${spotId}`);
    } catch (error) {
      setErrors({ general: error.message });
      console.error('Error updating spot:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Update your Spot</h1>
      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <label>
          Country
          <input type="text" name="country" value={formData.country} onChange={handleChange} required />
          {errors.country && <p className={styles.error}>{errors.country}</p>}
        </label>
        <label>
          Street Address
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          {errors.address && <p className={styles.error}>{errors.address}</p>}
        </label>
        <label>
          City
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          {errors.city && <p className={styles.error}>{errors.city}</p>}
        </label>
        <label>
          State
          <input type="text" name="state" value={formData.state} onChange={handleChange} required />
          {errors.state && <p className={styles.error}>{errors.state}</p>}
        </label>
        <label>
          Latitude
          <input type="text" name="lat" value={formData.lat} onChange={handleChange} />
          {errors.lat && <p className={styles.error}>{errors.lat}</p>}
        </label>
        <label>
          Longitude
          <input type="text" name="lng" value={formData.lng} onChange={handleChange} />
          {errors.lng && <p className={styles.error}>{errors.lng}</p>}
        </label>
        <label>
          Description
          <textarea name="description" value={formData.description} onChange={handleChange} required minLength="30" />
          {errors.description && <p className={styles.error}>{errors.description}</p>}
        </label>
        <label>
          Title
          <input type="text" name="name" value={formData.name} onChange={handleChange} required maxLength="50" />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </label>
        <label>
          Base price per night (USD)
          <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />
          {errors.price && <p className={styles.error}>{errors.price}</p>}
        </label>
        {[...Array(5)].map((_, idx) => (
          <label key={idx}>
            Image URL {idx + 1} (optional)
            <input type="text" name={`image-${idx}`} value={formData.imageUrls[idx]} onChange={handleChange} />
            {errors[`image-${idx}`] && <p className={styles.error}>{errors[`image-${idx}`]}</p>}
          </label>
        ))}
        <button type="submit">Update your Spot</button>
        {errors.general && <p className={styles.error}>{errors.general}</p>}
      </form>
    </div>
  );
};

export default UpdateSpot;
