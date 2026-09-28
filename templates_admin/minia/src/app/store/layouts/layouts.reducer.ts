import { Action, createReducer, on } from '@ngrx/store';
import { changesLayout, changeMode, changeLayoutWidth, changeSidebarMode, changeTopbarMode, changeSidebarSize, changeLayoutPosition } from './layout.actions';
import { DATA_LAYOUT_MODE, LAYOUT_MODE_TYPES, LAYOUT_POSITION_TYPE, LAYOUT_WIDTH_TYPES, SIDEBAR_SIZE_TYPES, SIDEBAR_TYPE, TOPBAR_MODE_TYPES } from './layout';

export interface LayoutState {
    LAYOUT_MODE: string;
    DATA_LAYOUT: string;
    LAYOUT_WIDTH: string;
    SIDEBAR_MODE: string;
    TOPBAR_TYPE: string;
    LAYOUT_POSITION: boolean;
    SIDEBAR_SIZE: string;
}

// INIT_STATE 
export const initialState: LayoutState = {
    LAYOUT_MODE: LAYOUT_MODE_TYPES.LIGHTMODE,
    DATA_LAYOUT: DATA_LAYOUT_MODE.VERTICAL,
    LAYOUT_WIDTH: LAYOUT_WIDTH_TYPES.FLUID,
    SIDEBAR_MODE: SIDEBAR_TYPE.LIGHT,
    TOPBAR_TYPE: TOPBAR_MODE_TYPES.LIGHT,
    LAYOUT_POSITION: LAYOUT_POSITION_TYPE.FIXED,
    SIDEBAR_SIZE: SIDEBAR_SIZE_TYPES.DEFAULT
}

// Reducer
export const layoutReducer = createReducer(
    initialState,
    on(changeMode, (state, action) => ({ ...state, LAYOUT_MODE: action.mode })),
    on(changesLayout, (state, action) => ({ ...state, DATA_LAYOUT: action.layoutMode })),
    on(changeLayoutWidth, (state, action) => ({ ...state, LAYOUT_WIDTH: action.layoutWidth })),
    on(changeSidebarMode, (state, action) => ({ ...state, SIDEBAR_MODE: action.sidebarMode })),
    on(changeTopbarMode, (state, action) => ({ ...state, TOPBAR_TYPE: action.topbarmode })),
    on(changeSidebarSize, (state, action) => ({ ...state, SIDEBAR_SIZE: action.sidebarsize })),
    on(changeLayoutPosition, (state, action) => ({
        ...state,
        LAYOUT_POSITION: action.layoutposition
    }))
);

// Selector
export function reducer(state: LayoutState | undefined, action: Action) {
    return layoutReducer(state, action);
}