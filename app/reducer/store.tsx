import {configureStore} from '@reduxjs/toolkit';
import sliceUserReducer from './sliceUser';
import sliceSectionReducer from './sliceSections';
import sliceClientReducer from './sliceClients';
import sliceCommercialAgentReducer from './sliceCommercialAgents';
import sliceEquipmentReducer from './sliceEquipment';
import sliceCurrentCotizationReducer from './sliceCurrentCotization';


const store = configureStore({
    reducer: {
        sliceUserReducer: sliceUserReducer,
        sliceSectionReducer: sliceSectionReducer,
        sliceClientReducer: sliceClientReducer,
        sliceCommertialAgentReducer: sliceCommercialAgentReducer,
        sliceEquipmentReducer: sliceEquipmentReducer,
        sliceCurrentCotizationReducer: sliceCurrentCotizationReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;