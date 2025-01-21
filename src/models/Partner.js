import { Schema, model, models } from "mongoose";
import {Document} from './Document';

const PartnerSchema = new Schema({
 
    professions: [{
        name: {
          type: String,
        },
        location: {
          type: String,
        },
        skills:{
          type: String
        },
        experience: { 
          type: String 
        },
        place:{
          type: Number
        },
        salary:{
          type: String
        },
        rentPrice:{
          type: String
        },
        avans: {
          type: String
        },
        // Рабочая одежда
      workwear: {
          type: String
      },
      drivePermis: [{
        type: String,
      }],
        langue: {
          name: String,
          level: String,
        },
        workHours:{
          type: Number
        },
        getStart:{
          status: Boolean,
          dateFrom: Date

        },
        candidates: [{
          type: Schema.Types.ObjectId,
          ref: 'Candidate'
        }],
        interview: [
          {
            type: Schema.Types.ObjectId, ref: 'Interview'
          }
        ]
      }],
      name: {
        type: String,
      },
      phone: {
        type: String,
      },
      viber: {
        type: String,
      },
       telegram: {
        type: String,
       },
       whatsapp: {
        type: String,
       },
      email: {
        type: String,
      },
      site: {
        type: String
      },
      companyName: {
        type: String,
      },
      numberDE: {
        type: String,
      },
      location: {
        type: String,
      },
      manager: {
        type: Schema.Types.ObjectId,
        ref: 'Manager'
      },
      candidates: [{
        type: Schema.Types.ObjectId,
        ref: 'Candidate'
      }],
      contract: {
        typeC: String,
        sum: String,
        salaryWorker: String,
      },
      documents: [{
        file: {
          type: Schema.Types.ObjectId,
          ref: 'Document'
        },
        docType: String,
        dateOfIssue: String,
        dateExp: String,
        numberDoc: String,
      }],
      status: {
        type: String
      },
    
      comment: [{
        author: {
          type: String
        },
        text: {
          type: String
        },
        date: {
          type: Date,
          default: Date.now
        }
      }],
    },
      { timestamps: true });

const Partner = models?.Partner || model("Partner", PartnerSchema);
export default Partner;