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
  const [errors, setErrors] = useState([]);
  const [csrfToken, setCsrfToken] = useState('');

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
        setErrors(data.errors ? Object.values(data.errors) : ["Something went wrong"]);
        return;
      }

      const spot = await response.json();
      navigate(`/spots/${spot.id}`);
    } catch (error) {
      setErrors([error.message]);
      console.error('Error creating spot:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errors && errors.length > 0 && (
          <ul className={styles.errors}>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        )}
        <label>
          Country
          <input type="text" name="country" value={formData.country} onChange={handleChange} required />
        </label>
        <label>
          Street Address
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>
        <label>
          City
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </label>
        <label>
          State
          <input type="text" name="state" value={formData.state} onChange={handleChange} required />
        </label>
        <label>
          Latitude
          <input type="text" name="lat" value={formData.lat} onChange={handleChange} />
        </label>
        <label>
          Longitude
          <input type="text" name="lng" value={formData.lng} onChange={handleChange} />
        </label>
        <label>
          Description
          <textarea name="description" value={formData.description} onChange={handleChange} required minLength="30" />
        </label>
        <label>
          Title
          <input type="text" name="name" value={formData.name} onChange={handleChange} required maxLength="50" />
        </label>
        <label>
          Base price per night (USD)
          <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />
        </label>
        {[...Array(5)].map((_, idx) => (
          <label key={idx}>
            Image URL {idx + 1} (optional)
            <input type="text" name={`image-${idx}`} value={formData.imageUrls[idx]} onChange={handleChange} />
          </label>
        ))}
        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
};

export default CreateSpotForm;
