const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  projectName: {
    type: String,
    required: true
  },
  tech: {
    type: String,
  },
  url: {
    type: String,
  },
  json: {},
  libraries: [],
  conflicts: [],
  updates: [
    {
      name: {
        type: String,
        required: true
      },
      version: {
        type: String
      },
      updatedVersion: {
        type: String
      },
      updatedDate: {
        type: Date,
      },
      updateAvailable: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      },
      repoUrl: {
        type: String
      },
      documentation: {
        type: String,
      },
      logo: {
        type: String,
      },
      license:{
        type: String,
      },
      dev: {
        type: Boolean,
        default: false
      },
      peer: {
        type: Boolean,
        default: false,
      }

    }
  ],
  status: {
    type: String,
    default: 'Online'
  },
  category: {
    type: String,
  },
  tags: [
    {
      name: {
        type: String,
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  restricted: {
    type: Boolean,
    default: false
  },
  lastRunStatus: {
    type: String,
    default: 'Good'
  },
  tests: [
    {
      name: {
        type: String,
      },
      testType: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      args: {},
      runs: []
    }
  ]
});

module.exports = Project = mongoose.model('Project', ProjectSchema);