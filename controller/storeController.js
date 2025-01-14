const  Store = require('../models/Store')

// Create a new store
exports.createStore = async (req, res) => {
  try {
    const { name, address, employees } = req.body;
    const store = new Store({ name, address, employees });
    await store.save();
    res.status(201).json(store);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all stores
exports.getAllStores = async (req, res) => {
  try {
    const stores = await Store.find().populate('employees.employeeId', 'username role email');

    res.status(200).json(stores);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get a store by ID
exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.status(200).json({ success: true, data: store });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getStoreByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from the request params

    const stores = await Store.find({ userId }).populate('employees.employeeId', 'username email role'); // Populate employee details

    if (!stores || stores.length === 0) {
      return res.status(404).json({ success: false, message: 'No stores found for this user' });
    }

    res.status(200).json({ success: true, data: stores });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Update a store
exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStore = await Store.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedStore) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.status(200).json({ success: true, data: updatedStore });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete a store
exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStore = await Store.findByIdAndDelete(id);
    if (!deletedStore) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.status(200).json({ success: true, message: 'Store deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add an employee to a store
exports.addEmployee = async (req, res) => {
  try {
    const { id } = req.params; // Store ID
    const { employeeId, name } = req.body;

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    store.employees.push({ employeeId, name });
    await store.save();
    res.status(200).json({ success: true, data: store });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Remove an employee from a store
exports.removeEmployee = async (req, res) => {
  try {
    const { id, employeeId } = req.params; // Store ID and Employee ID

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    store.employees = store.employees.filter((emp) => emp.employeeId !== employeeId);
    await store.save();
    res.status(200).json({ success: true, data: store });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
