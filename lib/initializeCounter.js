const Counter = require('../models/counter');

const initializeCounter = async () => {
  const counter = await Counter.findById('urlSeq');
  if (!counter) {
    const newCounter = new Counter({ _id: 'urlSeq', seq: 1000000000 });
    await newCounter.save();
  }
};

module.exports = initializeCounter;
