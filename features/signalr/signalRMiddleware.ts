import { HubConnection, HubConnectionBuilder, HubConnectionState, IHttpConnectionOptions, LogLevel } from "@microsoft/signalr";
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { signalRUrl } from "../../app.config";
import { AppDispatch, RootState } from "../../app/store";
import { INewDataMessage } from "../../models/signalr/INewDataMessage";
import { apiSlice } from "../api/apiSlice";
import { localLogout, setCredentials } from "../auth/authSlice";

export const signalRMiddleware = createListenerMiddleware();

let hubConnection: HubConnection | undefined = undefined;
signalRMiddleware.startListening({
    matcher: isAnyOf(
        setCredentials,
        apiSlice.endpoints.getAllNeighborhoodBuildings.matchFulfilled,
        apiSlice.endpoints.addBuilding.matchFulfilled,
        localLogout
    ),
    effect: async (action, listenerApi) => {
        if (isAnyOf(
            setCredentials,
            apiSlice.endpoints.getAllNeighborhoodBuildings.matchFulfilled
        )(action)) {
            if (!hubConnection || hubConnection.state === HubConnectionState.Disconnected) {
                const options: IHttpConnectionOptions = {
                    headers: {
                        "X-Custom-Auth": `Bearer ${(listenerApi.getState() as RootState).auth.accessToken}`
                    }
                };

                hubConnection = new HubConnectionBuilder()
                    .withUrl(signalRUrl, options)
                    .configureLogging(LogLevel.Information)
                    .build();

                hubConnection.on("newSystemData", (message: INewDataMessage) => {
                    (listenerApi.dispatch as AppDispatch)(
                        apiSlice.util.updateQueryData('getBuildingSystems', message.buildingId, (systems) => {
                            const system = systems.find(x => x.id === message.systemId);

                            system?.dataInputs.forEach((dataInput) => {
                                if (message.dataInputs[dataInput.id]) {
                                    dataInput.date = message.dataInputs[dataInput.id].date;
                                    dataInput.value = message.dataInputs[dataInput.id].value;
                                }
                            });

                            return systems;
                        })
                    );
                });

                hubConnection.start().then(() => {
                    if (hubConnection?.connectionId) {
                        listenerApi.dispatch(apiSlice.endpoints.subscribeAll.initiate({
                            connectionId: hubConnection.connectionId
                        }));
                    }
                });
            }
        } else if (action.type === localLogout.type) {
            if (hubConnection) {
                hubConnection.stop();
            }
        }
    }
});