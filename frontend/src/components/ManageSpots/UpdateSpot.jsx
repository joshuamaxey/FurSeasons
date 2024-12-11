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
  const [errors, setErrors] = useState([]);
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
        // After we fetch the details of the current spot, populate the form with the spot'd current data
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

  // Handle any changes that occur on the spot form in any of the fields. If the change occurs in one of the fields for an image, update the image field by it's index. Otherwise update the field directly
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

    // Then we make a PUT request to the backend route using the spots spotId in order to update the record for the spot in the database.
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
        setErrors(data.errors ? Object.values(data.errors) : ["Something went wrong"]);
        return;
      }

      // After we've udpated the spot, navigate automatically to that spot's spotDetails page
      navigate(`/spots/${spotId}`);
    } catch (error) {
      setErrors([error.message]);
      console.error('Error updating spot:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Update your Spot</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {errors.length > 0 && (
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
        <button type="submit">Update your Spot</button>
      </form>
    </div>
  );
};

export default UpdateSpot;
