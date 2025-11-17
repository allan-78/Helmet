import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormControlLabel,
  Slider,
  Divider,
  Button,
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import api from '../../services/api';

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data } = await api.get('/brands');
      setBrands(data.brands);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  const handlePriceChange = (event, newValue) => {
    onFilterChange({
      ...filters,
      minPrice: newValue[0],
      maxPrice: newValue[1],
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<Clear />}
          onClick={onClearFilters}
          sx={{ color: 'text.secondary' }}
        >
          Clear
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Categories */}
      <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
          Category
        </FormLabel>
        <RadioGroup
          value={filters.category || ''}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        >
          <FormControlLabel value="" control={<Radio />} label="All Categories" />
          {categories.map((category) => (
            <FormControlLabel
              key={category._id}
              value={category._id}
              control={<Radio />}
              label={category.name}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Divider sx={{ mb: 3 }} />

      {/* Brands */}
      <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
          Brand
        </FormLabel>
        {brands.map((brand) => (
          <FormControlLabel
            key={brand._id}
            control={
              <Checkbox
                checked={filters.brand === brand._id}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    brand: e.target.checked ? brand._id : '',
                  })
                }
              />
            }
            label={brand.name}
          />
        ))}
      </FormControl>

      <Divider sx={{ mb: 3 }} />

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Price Range
        </Typography>
        <Slider
          value={[filters.minPrice || 0, filters.maxPrice || 50000]}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={50000}
          step={1000}
          marks={[
            { value: 0, label: '₱0' },
            { value: 50000, label: '₱50K' },
          ]}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            ₱{(filters.minPrice || 0).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ₱{(filters.maxPrice || 50000).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Rating */}
      <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
        <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
          Rating
        </FormLabel>
        <RadioGroup
          value={filters.rating || ''}
          onChange={(e) => onFilterChange({ ...filters, rating: e.target.value })}
        >
          <FormControlLabel value="" control={<Radio />} label="All Ratings" />
          <FormControlLabel value="4" control={<Radio />} label="4★ & above" />
          <FormControlLabel value="3" control={<Radio />} label="3★ & above" />
        </RadioGroup>
      </FormControl>

      <Divider sx={{ mb: 3 }} />

      {/* Sort */}
      <FormControl component="fieldset" fullWidth>
        <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
          Sort By
        </FormLabel>
        <RadioGroup
          value={filters.sort || ''}
          onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
        >
          <FormControlLabel value="" control={<Radio />} label="Newest" />
          <FormControlLabel value="price-asc" control={<Radio />} label="Price: Low to High" />
          <FormControlLabel value="price-desc" control={<Radio />} label="Price: High to Low" />
          <FormControlLabel value="rating" control={<Radio />} label="Top Rated" />
        </RadioGroup>
      </FormControl>
    </Paper>
  );
};

export default ProductFilters;
