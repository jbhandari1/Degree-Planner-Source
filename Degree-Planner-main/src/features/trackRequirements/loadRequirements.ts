import { createAsyncThunk } from '@reduxjs/toolkit'
import { TrackRequirements } from './model'
import cyber_security from 'track_requirements/cyber_security.json'
import data_science from 'track_requirements/data_science.json'
import intelligent_systems from 'track_requirements/intelligent_systems.json'
import interactive_computing from 'track_requirements/interactive_computing.json'
import networks_telecommunication from 'track_requirements/networks_telecommunication.json'
import software_engineering from 'track_requirements/software_engineering.json'
import systems from 'track_requirements/systems.json'
import traditional_cs from 'track_requirements/traditional_cs.json'

const loadRequirements = createAsyncThunk(
    'trackRequirements/load',
    async (): Promise<TrackRequirements[]> => {
        if (window.degreeRequirements) {
            return await window.degreeRequirements.load()
        }

        return [
            cyber_security,
            data_science,
            intelligent_systems,
            interactive_computing,
            networks_telecommunication,
            software_engineering,
            systems,
            traditional_cs,
        ]
    }
)
export default loadRequirements
