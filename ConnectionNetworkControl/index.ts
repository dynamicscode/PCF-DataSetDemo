import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
import * as Vis from 'vis';
import { triggerAsyncId } from "async_hooks";

type DataSet = ComponentFramework.PropertyTypes.DataSet;

// interface Node {
// 	id: string;
// 	label: string;
// }

// interface Edge {
// 	from: string;
// 	to: string;
// 	label: string;
// }

export class ConnectionNetworkControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private nodes:any[];
	private edges:any[];
	private mainContainer: HTMLDivElement;

	private vis:Vis.Network;
	//let columns:Columns[];
	/**
	 * Empty constructor.
	 */
	constructor()
	{
		this.nodes = [];
		this.edges = [];
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this.mainContainer = document.createElement("div");
		this.mainContainer.setAttribute("style", "height:400px;");
		container.appendChild(this.mainContainer);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		//let columns = context.parameters.dataSetGrid.columns;
		this.createNodes(context.parameters.dataSetGrid);
		this.vis = new Vis.Network(this.mainContainer, { nodes: this.nodes, edges: this.edges}, {});
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
 
	private createNodes(gridParam: DataSet): void
	{
		for (let currentRecordId of gridParam.sortedRecordIds) {
			let record1id = (gridParam.records[currentRecordId].getValue("record1id") as any).id.guid;
			let record1name = gridParam.records[currentRecordId].getFormattedValue("record1id");
			let record2id = (gridParam.records[currentRecordId].getValue("record2id") as any).id.guid;
			let record2name = gridParam.records[currentRecordId].getFormattedValue("record2id");
			let record2rolename = gridParam.records[currentRecordId].getFormattedValue("record2roleid");
			if (this.nodes.find(e => e.id === record2id) === undefined) {
				this.nodes.push({
					id: record2id, 
					label: record2name
				});
			}

			if (this.nodes.find(e => e.id === record1id) === undefined) {
				this.nodes.push({
					id: record1id,
					label: record1name
				});
			}

			if (this.edges.find( e=> e.to === record2id) === undefined) {
				this.edges.push({
					from: record1id,
					to: record2id,
					label: record2rolename
				});
			}
		}
	}
}