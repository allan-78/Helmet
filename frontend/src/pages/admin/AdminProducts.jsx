import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Checkbox,
  Stack,
  InputAdornment,
  Avatar,
} from '@mui/material';
import { Add, Edit, Delete, DeleteSweep, Image as ImageIcon, Search } from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Loading from '../../components/common/Loading';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const productSchema = yup.object({
    name: yup.string().required('Product name is required'),
    description: yup.string().required('Description is required'),
    price: yup
      .number()
      .typeError('Enter a valid price')
      .positive('Price must be positive')
      .required('Price is required'),
    stock: yup
      .number()
      .typeError('Enter a valid stock value')
      .min(0, 'Stock cannot be negative')
      .required('Stock is required'),
    weight: yup
      .number()
      .typeError('Enter a valid weight')
      .positive('Weight must be positive')
      .required('Weight is required'),
    category: yup.string().required('Category is required'),
    brand: yup.string().required('Brand is required'),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      stock: '',
      weight: '',
    },
    resolver: yupResolver(productSchema),
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.products);
      setSelectedProductIds((prev) =>
        prev.filter((id) => data.products.some((product) => product._id === id))
      );
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data } = await api.get('/brands');
      setBrands(data.brands);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category._id,
        brand: product.brand._id,
        stock: product.stock,
        weight: product.weight,
      });
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        weight: '',
      });
    }
    setSelectedImages([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setSelectedImages([]);
  };

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const mapped = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${file.lastModified}`,
    }));
    setSelectedImages((prev) => [...prev, ...mapped]);
  };

  const handleRemoveImage = (id) => {
    setSelectedImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  useEffect(() => {
    return () => {
      selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [selectedImages]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProductIds(filteredProducts.map((product) => product._id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectOne = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedProductIds.length} selected products?`)) return;
    try {
      await api.post('/admin/products/bulk-delete', { productIds: selectedProductIds });
      toast.success('Selected products deleted');
      setSelectedProductIds([]);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk delete failed');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category?._id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, categoryFilter]);

  const onSubmit = async (values) => {
    try {
      const formPayload = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      selectedImages.forEach(({ file }) => {
        formPayload.append('images', file);
      });

      if (!editingProduct && selectedImages.length === 0) {
        toast.error('Please upload at least one image');
        return;
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, formPayload, config);
        toast.success('Product updated!');
      } else {
        await api.post('/admin/products', formPayload, config);
        toast.success('Product created!');
      }
      fetchProducts();
      handleCloseDialog();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        toast.success('Product deleted!');
        fetchProducts();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  if (loading) return <Loading />;

  const allSelected = filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length;
  const someSelected = selectedProductIds.length > 0 && !allSelected;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Product Catalog
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage helmet inventory, pricing, and visibility.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {selectedProductIds.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweep />}
                onClick={handleBulkDelete}
              >
                Delete Selected ({selectedProductIds.length})
              </Button>
            )}
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
              Add Product
            </Button>
          </Stack>
        </Stack>

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, rgba(15,15,15,0.95), rgba(5,5,5,0.95))',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
            <TextField
              placeholder="Search by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <TextField
              select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: 0,
            borderRadius: 3,
            border: '1px solid rgba(255,255,255,0.05)',
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allSelected}
                      indeterminate={someSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product._id} hover selected={selectedProductIds.includes(product._id)}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedProductIds.includes(product._id)}
                          onChange={() => handleSelectOne(product._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            variant="rounded"
                            src={product.images?.[0]?.url}
                            sx={{ width: 48, height: 48, bgcolor: 'rgba(255,255,255,0.08)' }}
                          >
                            <ImageIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {product.description.slice(0, 32)}...
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={product.category?.name || '—'} size="small" />
                      </TableCell>
                      <TableCell>{product.brand?.name || '—'}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>₱{product.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={`${product.stock} units`}
                          size="small"
                          color={product.stock < 10 ? 'error' : 'success'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.isActive ? 'Active' : 'Inactive'}
                          color={product.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpenDialog(product)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(product._id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No products match your filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Stack>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Product Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Price"
                    type="number"
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Stock"
                    type="number"
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Category"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Brand"
                    error={!!errors.brand}
                    helperText={errors.brand?.message}
                  >
                    {brands.map((brand) => (
                      <MenuItem key={brand._id} value={brand._id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="weight"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Weight (grams)"
                    type="number"
                    error={!!errors.weight}
                    helperText={errors.weight?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Upload Images
                <input type="file" hidden multiple accept="image/*" onChange={handleImageSelect} />
              </Button>
              <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                {editingProduct
                  ? 'Upload to replace images, or leave empty to keep the current gallery.'
                  : 'Upload one or more product images.'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                {selectedImages.map((img) => (
                  <Box
                    key={img.id}
                    sx={{
                      position: 'relative',
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <Box
                      component="img"
                      src={img.preview}
                      alt="preview"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Button
                      size="small"
                      onClick={() => handleRemoveImage(img.id)}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        minWidth: 0,
                        p: 0.5,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        color: 'white',
                      }}
                    >
                      ×
                    </Button>
                  </Box>
                ))}
              </Box>
            </Grid>
            {editingProduct && editingProduct.images?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Current Gallery
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {editingProduct.images.map((img) => (
                    <Avatar
                      key={img.publicId}
                      variant="rounded"
                      src={img.url}
                      sx={{ width: 56, height: 56, borderRadius: 2 }}
                    />
                  ))}
                </Stack>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)' }}
          >
            {editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProducts;
