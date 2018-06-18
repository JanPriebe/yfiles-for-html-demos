/****************************************************************************
 ** @license
 ** This demo file is part of yFiles for HTML 2.1.
 ** Copyright (c) 2000-2018 by yWorks GmbH, Vor dem Kreuzberg 28,
 ** 72070 Tuebingen, Germany. All rights reserved.
 **
 ** yFiles demo files exhibit yFiles for HTML functionalities. Any redistribution
 ** of demo files in source code or binary form, with or without
 ** modification, is not permitted.
 **
 ** Owners of a valid software license for a yFiles for HTML version that this
 ** demo is shipped with are allowed to use the demo source code as basis
 ** for their own yFiles for HTML powered applications. Use of such programs is
 ** governed by the rights and conditions as set out in the yFiles for HTML
 ** license agreement.
 **
 ** THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY EXPRESS OR IMPLIED
 ** WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 ** MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN
 ** NO EVENT SHALL yWorks BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 ** SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 ** TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 ** PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 ** LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 ** NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 ** SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **
 ***************************************************************************/
'use strict'

define(['yfiles/view-layout-bridge', 'FlowchartElements.js', 'yfiles/layout-hierarchic'], (
  /** @type {yfiles_namespace} */ /** typeof yfiles */ yfiles,
  FlowchartElements
) => {
  /**
   * An automatic layout algorithm for flowchart diagrams. The different type of elements have to be marked with the
   * DataProvider keys {@link FlowchartElements#EDGE_TYPE_DP_KEY} and {@link FlowchartElements#NODE_TYPE_DP_KEY}.
   */
  class FlowchartLayout extends yfiles.lang.Class(yfiles.layout.ILayoutAlgorithm) {
    constructor() {
      super()
      this.transformerStage = new FlowchartTransformerStage()
      this.$allowFlatwiseEdges = true
      this.$layoutOrientation = yfiles.layout.LayoutOrientation.TOP_TO_BOTTOM
      this.$laneInsets = 10.0
      this.$minimumEdgeDistance = 15.0
      this.$minimumEdgeLength = 30.0
      this.minimumLabelDistance = 20.0
      this.$minimumNodeDistance = 30.0
      this.$minimumPoolDistance = 30.0
    }

    /**
     * Gets whether or not flatwise edges are allowed. Flatwise edges are same layer edges, if they are not allowed
     * they will still leave their source at the sides but their target is in another layer.
     * @type {boolean}
     */
    get allowFlatwiseEdges() {
      return this.$allowFlatwiseEdges
    }

    /**
     * Gets whether or not flatwise edges are allowed. Flatwise edges are same layer edges, if they are not allowed
     * they will still leave their source at the sides but their target is in another layer.
     * @type {boolean}
     */
    set allowFlatwiseEdges(value) {
      this.$allowFlatwiseEdges = value
    }

    /**
     * Gets the insets defining the distance between graph elements and the border of their enclosing swimlanes.
     * Defaults to <code>10.0</code>.
     * @type {number}
     */
    get laneInsets() {
      return this.$laneInsets
    }

    /**
     * Sets the insets defining the distance between graph elements and the border of their enclosing swimlanes.
     * Defaults to <code>10.0</code>.
     * @type {number}
     */
    set laneInsets(value) {
      this.$laneInsets = value
    }

    /**
     * Gets the minimum distance between two node elements.
     * Defaults to <code>30.0</code>.
     * @type {number}
     */
    get minimumNodeDistance() {
      return this.$minimumNodeDistance
    }

    /**
     * Sets the minimum distance between two node elements.
     * Defaults to <code>30.0</code>.
     * @type {number}
     */
    set minimumNodeDistance(value) {
      this.$minimumNodeDistance = value
    }

    /**
     * Gets the minimum distance between two edge elements.
     * Defaults to <code>30.0</code>.
     * @type {number}
     */
    get minimumEdgeDistance() {
      return this.$minimumEdgeDistance
    }

    /**
     * Sets the minimum distance between two edge elements.
     * Defaults to <code>30.0</code>.
     * @type {number}
     */
    set minimumEdgeDistance(value) {
      this.$minimumEdgeDistance = value
    }

    /**
     * Gets the minimum length of edges.
     * Defaults to <code>20.0</code>.
     * @type {number}
     */
    get minimumEdgeLength() {
      return this.$minimumEdgeLength
    }

    /**
     * Sets the minimum length of edges.
     * Defaults to <code>20.0</code>.
     * @type {number}
     */
    set minimumEdgeLength(value) {
      this.$minimumEdgeLength = value
    }

    /**
     * Gets the used minimum distance between two pool elements.
     * Defaults to <code>50.0</code>.
     * @type {number}
     */
    get minimumPoolDistance() {
      return this.$minimumPoolDistance
    }

    /**
     * Sets the used minimum distance between two pool elements.
     * Defaults to <code>50.0</code>.
     * @type {number}
     */
    set minimumPoolDistance(value) {
      this.$minimumPoolDistance = value
    }

    /**
     * Gets the layout orientation.
     * Defaults to {@link yfiles.layout.LayoutOrientation#TOP_TO_BOTTOM}.
     * @type {yfiles.layout.LayoutOrientation#TOP_TO_BOTTOM|yfiles.layout.LayoutOrientation#LEFT_TO_RIGHT}
     * @throws {Error} if the specified orientation does not match any of the layout orientation
     * constants defined in this class.
     */
    get layoutOrientation() {
      return this.$layoutOrientation
    }

    /**
     * Sets the layout orientation.
     * Defaults to {@link yfiles.layout.LayoutOrientation#TOP_TO_BOTTOM}.
     * @type {yfiles.layout.LayoutOrientation#TOP_TO_BOTTOM|yfiles.layout.LayoutOrientation#LEFT_TO_RIGHT}
     * @throws {Error} if the specified orientation does not match any of the layout orientation
     * constants defined in this class.
     */
    set layoutOrientation(value) {
      switch (value) {
        case yfiles.layout.LayoutOrientation.TOP_TO_BOTTOM:
        case yfiles.layout.LayoutOrientation.LEFT_TO_RIGHT: {
          this.$layoutOrientation = value
          break
        }
        default: {
          throw new Error(`Invalid layout orientation: ${value}`)
        }
      }
    }

    applyLayout(graph) {
      if (graph.empty) {
        return
      }

      const grid = yfiles.layout.PartitionGrid.getPartitionGrid(graph)
      if (grid) {
        // adjust insets
        grid.columns.forEach(column => {
          column.leftInset = this.$laneInsets
          column.rightInset = this.$laneInsets
        })

        grid.rows.forEach(row => {
          row.topInset = this.$laneInsets
          row.bottomInset = this.$laneInsets
        })
      }

      try {
        const hierarchicLayout = this.configureHierarchicLayout()
        this.transformerStage = new FlowchartTransformerStage()
        this.transformerStage.coreLayout = hierarchicLayout
        const layerIds = yfiles.algorithms.Maps.createHashedNodeMap()
        try {
          graph.addDataProvider(yfiles.hierarchic.HierarchicLayout.LAYER_INDEX_DP_KEY, layerIds)
          this.transformerStage.applyLayout(graph)
        } finally {
          graph.removeDataProvider(yfiles.hierarchic.HierarchicLayout.LAYER_INDEX_DP_KEY)
        }
        const edge2LayoutDescriptor = yfiles.algorithms.Maps.createHashedEdgeMap()
        graph.edges.forEach(edge => {
          edge2LayoutDescriptor.set(
            edge,
            this.createEdgeLayoutDescriptor(
              edge,
              graph,
              hierarchicLayout.edgeLayoutDescriptor,
              this.isHorizontalOrientation()
            )
          )
        })
        // apply core layout
        try {
          graph.addDataProvider(FlowchartTransformerStage.LAYER_ID_DP_KEY, layerIds)
          graph.addDataProvider(
            yfiles.hierarchic.HierarchicLayoutCore.EDGE_LAYOUT_DESCRIPTOR_DP_KEY,
            edge2LayoutDescriptor
          )
          this.transformerStage.applyLayout(graph)

          const portCalculator = new yfiles.layout.PortCalculator()
          portCalculator.applyLayout(graph)
        } finally {
          graph.removeDataProvider(FlowchartTransformerStage.LAYER_ID_DP_KEY)
          graph.removeDataProvider(
            yfiles.hierarchic.HierarchicLayoutCore.EDGE_LAYOUT_DESCRIPTOR_DP_KEY
          )
        }
      } finally {
        // remove key set by the FlowchartPortOptimizer
        graph.removeDataProvider(FlowchartPortOptimizer.NODE_TO_ALIGN_DP_KEY)
      }
      applyLabelPlacement(graph)
    }

    /**
     * Returns an HierarchicLayout that is configured to fit this layout's needs.
     * @return {yfiles.hierarchic.HierarchicLayout}
     */
    configureHierarchicLayout() {
      const hierarchicLayout = new yfiles.hierarchic.HierarchicLayout()
      hierarchicLayout.orthogonalRouting = true
      hierarchicLayout.recursiveGroupLayering = false
      hierarchicLayout.componentLayoutEnabled = false
      hierarchicLayout.minimumLayerDistance = this.$minimumNodeDistance
      hierarchicLayout.nodeToNodeDistance = this.$minimumNodeDistance
      hierarchicLayout.edgeToEdgeDistance = this.$minimumEdgeDistance
      hierarchicLayout.backLoopRouting = false
      hierarchicLayout.layoutOrientation = this.isHorizontalOrientation()
        ? yfiles.layout.LayoutOrientation.LEFT_TO_RIGHT
        : yfiles.layout.LayoutOrientation.TOP_TO_BOTTOM
      hierarchicLayout.integratedEdgeLabeling = false
      hierarchicLayout.considerNodeLabels = true
      const descriptor = new yfiles.hierarchic.EdgeLayoutDescriptor()
      descriptor.minimumDistance = this.$minimumEdgeDistance
      descriptor.minimumLength = 15.0
      descriptor.minimumFirstSegmentLength = 15.0
      descriptor.minimumLastSegmentLength = 15.0
      descriptor.routingStyle = new yfiles.hierarchic.RoutingStyle(
        yfiles.hierarchic.EdgeRoutingStyle.ORTHOGONAL
      )
      hierarchicLayout.edgeLayoutDescriptor = descriptor
      hierarchicLayout.hierarchicLayoutCore.portConstraintOptimizer = new FlowchartPortOptimizer(
        this.layoutOrientation
      )
      const layerer = new FlowchartLayerer()
      layerer.allowFlatwiseDefaultFlow = this.allowFlatwiseEdges
      hierarchicLayout.fromScratchLayerer = layerer
      const nodePlacer = hierarchicLayout.nodePlacer
      nodePlacer.barycenterMode = true
      nodePlacer.straightenEdges = true
      return hierarchicLayout
    }

    /**
     * Creates a descriptor that has a minimum edge length that is long enough for a proper placement of all of the
     * edge's labels.
     * @return {yfiles.hierarchic.EdgeLayoutDescriptor}
     */
    createEdgeLayoutDescriptor(
      /** yfiles.algorithms.Edge */ e,
      /** yfiles.layout.LayoutGraph */ g,
      /** yfiles.hierarchic.EdgeLayoutDescriptor */ defaultDescriptor /** boolean */,
      horizontal
    ) {
      const ell = g.getLabelLayout(e)
      let minLength = 0.0
      ell.forEach(label => {
        const labelSize = label.boundingBox
        if (FlowchartElements.isRegularEdge(g, e)) {
          minLength += horizontal ? labelSize.width : labelSize.height
        } else {
          minLength += horizontal ? labelSize.height : labelSize.width
        }
      })
      // add distance between labels and to the end-nodes
      if (ell.length > 0) {
        minLength += this.$minimumNodeDistance + (ell.length - 1) * this.minimumLabelDistance
      }
      const descriptor = new yfiles.hierarchic.EdgeLayoutDescriptor()
      descriptor.minimumDistance = defaultDescriptor.minimumDistance
      descriptor.minimumLength = Math.max(minLength, defaultDescriptor.minimumLength)
      descriptor.minimumFirstSegmentLength = defaultDescriptor.minimumFirstSegmentLength
      descriptor.minimumLastSegmentLength = defaultDescriptor.minimumLastSegmentLength
      descriptor.routingStyle = defaultDescriptor.routingStyle
      return descriptor
    }

    /**
     * Returns whether or not the current layout orientation is horizontal.
     * @return {boolean}
     */
    isHorizontalOrientation() {
      return this.$layoutOrientation === yfiles.layout.LayoutOrientation.LEFT_TO_RIGHT
    }

    /**
     * {@link yfiles.algorithms.IDataProvider} key used to specify the preferred source port direction of an edge.
     * Valid are direction type constants specified in this class.
     * @type {Object}
     */
    static get PREFERRED_DIRECTION_DP_KEY() {
      return 'FlowchartLayout.DIRECTION_DP_KEY'
    }

    /**
     * {@link yfiles.algorithms.IDataProvider} key used to specify the node and edge labels that
     * may be placed by the algorithm.
     * The data provider's {@link yfiles.algorithms.IDataProvider#getBoolean getBoolean} method has to return
     * <code>true</code> for labels that should be placed and <code>false</code>
     * for all other labels. If no data provider is registered for this key, all
     * labels are placed by the algorithm.
     * @type {Object}
     */
    static get LABEL_LAYOUT_DP_KEY() {
      return 'FlowchartLayout.LABEL_LAYOUT_DP_KEY'
    }

    /**
     * Constant which describes an undefined direction for edges.
     * @type {number}
     */
    static get DIRECTION_UNDEFINED() {
      return 0x0
    }

    /**
     * Constant which describes a direction in flow for edges.
     * @type {number}
     */
    static get DIRECTION_WITH_THE_FLOW() {
      return 0x1
    }

    /**
     * Constant which describes a direction against the flow for edges.
     * @type {number}
     */
    static get DIRECTION_AGAINST_THE_FLOW() {
      return 0x2
    }

    /**
     * Constant which describes a direction left in flow for edges.
     * @type {number}
     */
    static get DIRECTION_LEFT_IN_FLOW() {
      return 0x4
    }

    /**
     * Constant which describes a direction right in flow for edges.
     * @type {number}
     */
    static get DIRECTION_RIGHT_IN_FLOW() {
      return 0x8
    }

    /**
     * Constant which describes a straight direction for edges.
     * @type {number}
     */
    static get DIRECTION_STRAIGHT() {
      return FlowchartLayout.DIRECTION_WITH_THE_FLOW | FlowchartLayout.DIRECTION_AGAINST_THE_FLOW
    }

    /**
     * Constant which describes a direction left or right in flow for edges.
     * @type {number}
     */
    static get DIRECTION_FLATWISE() {
      return FlowchartLayout.DIRECTION_LEFT_IN_FLOW | FlowchartLayout.DIRECTION_RIGHT_IN_FLOW
    }

    /**
     * Returns whether or not the data holder represents a flatwise branch.
     * @return {boolean}
     */
    static isFlatwiseBranch(/** yfiles.algorithms.IDataProvider */ branchTypes, dataHolder) {
      return branchTypes && FlowchartLayout.isFlatwiseBranchType(branchTypes.getInt(dataHolder))
    }

    /**
     * Returns whether or not the data holder represents a flatwise branch.
     * @param {yfiles.algorithms.IDataProvider|yfiles.algorithms.Graph} provider;
     * @param {yfiles.algorithms.Edge} dataHolder
     * @return {boolean}
     */
    static isStraightBranch(provider, dataHolder) {
      if (provider instanceof yfiles.algorithms.Graph) {
        return FlowchartLayout.isStraightBranch(
          provider.getDataProvider(FlowchartLayout.PREFERRED_DIRECTION_DP_KEY),
          dataHolder
        )
      }
      return provider && FlowchartLayout.isStraightBranchType(provider.getInt(dataHolder))
    }

    /**
     * Returns whether or not the type represents a flatwise branch.
     * @return {boolean}
     */
    static isFlatwiseBranchType(/** number */ type) {
      return (type & FlowchartLayout.DIRECTION_FLATWISE) !== 0
    }

    /**
     * Returns whether or not the type represents a straight branch.
     * @return {boolean}
     */
    static isStraightBranchType(/** number */ type) {
      return (type & FlowchartLayout.DIRECTION_STRAIGHT) !== 0
    }

    /**
     * Restores the data provider for the given key.
     * @param {yfiles.layout.LayoutGraph} graph
     * @param {yfiles.algorithms.IDataProvider} dataProvider
     * @param {string|yfiles.algorithms.NodeDpKey|yfiles.algorithms.EdgeDpKey} key
     */
    static restoreDataProvider(graph, dataProvider, key) {
      graph.removeDataProvider(key)
      if (dataProvider) {
        graph.addDataProvider(key, dataProvider)
      }
    }
  }

  /**
   * Places the labels.
   */
  function applyLabelPlacement(/** yfiles.layout.LayoutGraph */ graph) {
    const labeling = new yfiles.labeling.GenericLabeling()
    labeling.selectedLabelsDpKey = FlowchartLayout.LABEL_LAYOUT_DP_KEY
    labeling.placeNodeLabels = true
    labeling.placeEdgeLabels = true
    labeling.profitModel = new FlowchartLabelProfitModel(graph)
    labeling.customProfitModelRatio = 0.25
    labeling.deterministic = true
    try {
      graph.addDataProvider(
        yfiles.labeling.LabelingBase.LABEL_MODEL_DP_KEY,
        new LabelModelProvider()
      )
      labeling.applyLayout(graph)
    } finally {
      graph.removeDataProvider(yfiles.labeling.LabelingBase.LABEL_MODEL_DP_KEY)
    }
  }

  /**
   * DataProvider which provides discrete label models for node and edge labels.
   */
  class LabelModelProvider extends yfiles.algorithms.DataProviderAdapter {
    get(dataHolder) {
      if (yfiles.layout.INodeLabelLayout.isInstance(dataHolder)) {
        return new yfiles.layout.DiscreteNodeLabelLayoutModel(
          yfiles.layout.DiscreteNodeLabelPositions.CENTER
        )
      } else if (yfiles.layout.IEdgeLabelLayout.isInstance(dataHolder)) {
        const labelModel = new yfiles.layout.DiscreteEdgeLabelLayoutModel(
          yfiles.layout.DiscreteEdgeLabelPositions.SIX_POS
        )
        labelModel.autoRotation = false
        return labelModel
      }
      return null
    }
  }

  const DUMMY_NODE_SIZE = 2.0

  /**
   * Transforms the graph for the flowchart layout algorithm and creates related port candidates and edge groupings.
   * This class expects to find an HierarchicLayout in its core layouts. It does its transformation,
   * invokes the core layout and finally restores the original graph.
   */
  class FlowchartTransformerStage extends yfiles.layout.LayoutStageBase {
    constructor() {
      super()
      this.northCandidate = yfiles.layout.PortCandidate.createCandidate(
        yfiles.layout.PortDirections.NORTH,
        0.0
      )
      this.eastCandidate = yfiles.layout.PortCandidate.createCandidate(
        yfiles.layout.PortDirections.EAST,
        0.0
      )
      this.southCandidate = yfiles.layout.PortCandidate.createCandidate(
        yfiles.layout.PortDirections.SOUTH,
        0.0
      )
      this.westCandidate = yfiles.layout.PortCandidate.createCandidate(
        yfiles.layout.PortDirections.WEST,
        0.0
      )

      this.layoutOrientation = 0
      this.sourceGroupIds = null
      this.targetGroupIds = null
      this.sourceCandidates = null
      this.targetCandidates = null
      this.groupingDummiesMap = null
      this.dummyLayerIds = null
      this.groupNodeIdWrapper = null
    }

    applyLayout(graph) {
      const hierarchicLayout = getHierarchicCoreLayout(this)
      if (!hierarchicLayout) {
        return
      }
      this.layoutOrientation = hierarchicLayout.layoutOrientation
      if (yfiles.layout.GroupingSupport.isGrouped(graph)) {
        this.groupNodeIdWrapper = new HashedDataProviderWrapper(
          yfiles.algorithms.Maps.createHashMap(),
          graph.getDataProvider(yfiles.layout.GroupingKeys.NODE_ID_DP_KEY)
        )
        graph.addDataProvider(yfiles.layout.GroupingKeys.NODE_ID_DP_KEY, this.groupNodeIdWrapper)
      }
      // Backup all data provide this class may overwrite
      const backupNodeIdDP = graph.getDataProvider(yfiles.layout.LayoutKeys.NODE_ID_DP_KEY)
      const backupNodePcDP = graph.getDataProvider(
        yfiles.layout.PortCandidateSet.NODE_PORT_CANDIDATE_SET_DP_KEY
      )
      const backupSourcePcDP = graph.getDataProvider(
        yfiles.layout.PortCandidate.SOURCE_PORT_CANDIDATE_COLLECTION_DP_KEY
      )
      const backupTargetPcDP = graph.getDataProvider(
        yfiles.layout.PortCandidate.TARGET_PORT_CANDIDATE_COLLECTION_DP_KEY
      )
      const backupSourceGroupDP = graph.getDataProvider(
        yfiles.layout.PortConstraintKeys.SOURCE_GROUP_ID_DP_KEY
      )
      const backupTargetGroupDP = graph.getDataProvider(
        yfiles.layout.PortConstraintKeys.TARGET_GROUP_ID_DP_KEY
      )
      const backupSourceConstraintsDP = graph.getDataProvider(
        yfiles.layout.PortConstraintKeys.SOURCE_PORT_CONSTRAINT_DP_KEY
      )
      const backupTargetConstraintsDP = graph.getDataProvider(
        yfiles.layout.PortConstraintKeys.TARGET_PORT_CONSTRAINT_DP_KEY
      )
      graph.removeDataProvider(yfiles.layout.PortConstraintKeys.SOURCE_PORT_CONSTRAINT_DP_KEY)
      graph.removeDataProvider(yfiles.layout.PortConstraintKeys.TARGET_PORT_CONSTRAINT_DP_KEY)
      const provider = new IdProvider()
      graph.addDataProvider(
        yfiles.layout.LayoutKeys.NODE_ID_DP_KEY,
        new NodeIdDataProvider(backupNodeIdDP, provider)
      )
      try {
        // Don't register the new data providers before the configuration is done
        // since the old data might be needed
        this.sourceCandidates = yfiles.algorithms.Maps.createHashedEdgeMap()
        this.targetCandidates = yfiles.algorithms.Maps.createHashedEdgeMap()
        this.configurePreferredEdgeDirections(graph)
        if (graph.getDataProvider(yfiles.layout.PortConstraintKeys.TARGET_GROUP_ID_DP_KEY)) {
          this.dummyLayerIds = yfiles.algorithms.Maps.createHashedNodeMap()
          this.groupingDummiesMap = yfiles.algorithms.Maps.createHashedNodeMap()
          this.sourceGroupIds = yfiles.algorithms.Maps.createHashedEdgeMap()
          this.targetGroupIds = yfiles.algorithms.Maps.createHashedEdgeMap()
          this.configureInEdgeGrouping(graph)
          graph.addDataProvider(
            FlowchartTransformerStage.GROUPING_NODES_DP_KEY,
            this.groupingDummiesMap
          )
          graph.addDataProvider(
            yfiles.layout.PortConstraintKeys.SOURCE_GROUP_ID_DP_KEY,
            this.sourceGroupIds
          )
          graph.addDataProvider(
            yfiles.layout.PortConstraintKeys.TARGET_GROUP_ID_DP_KEY,
            this.targetGroupIds
          )
        }
        graph.removeDataProvider(yfiles.layout.PortCandidateSet.NODE_PORT_CANDIDATE_SET_DP_KEY)
        graph.addDataProvider(
          yfiles.layout.PortCandidate.SOURCE_PORT_CANDIDATE_COLLECTION_DP_KEY,
          this.sourceCandidates
        )
        graph.addDataProvider(
          yfiles.layout.PortCandidate.TARGET_PORT_CANDIDATE_COLLECTION_DP_KEY,
          this.targetCandidates
        )
        this.applyLayoutCore(graph)
      } finally {
        this.dummyLayerIds = null
        this.groupingDummiesMap = null
        this.sourceCandidates = null
        this.targetCandidates = null
        this.sourceGroupIds = null
        this.targetGroupIds = null
        if (this.groupNodeIdWrapper) {
          FlowchartLayout.restoreDataProvider(
            graph,
            this.groupNodeIdWrapper.fallback,
            yfiles.layout.GroupingKeys.NODE_ID_DP_KEY
          )
          this.groupNodeIdWrapper = null
        }
        FlowchartLayout.restoreDataProvider(
          graph,
          backupSourceConstraintsDP,
          yfiles.layout.PortConstraintKeys.SOURCE_PORT_CONSTRAINT_DP_KEY
        )
        FlowchartLayout.restoreDataProvider(
          graph,
          backupTargetConstraintsDP,
          yfiles.layout.PortConstraintKeys.TARGET_PORT_CONSTRAINT_DP_KEY
        )
        FlowchartLayout.restoreDataProvider(
          graph,
          backupNodePcDP,
          yfiles.layout.PortCandidateSet.NODE_PORT_CANDIDATE_SET_DP_KEY
        )
        FlowchartLayout.restoreDataProvider(
          graph,
          backupSourcePcDP,
          yfiles.layout.PortCandidate.SOURCE_PORT_CANDIDATE_COLLECTION_DP_KEY
        )
        FlowchartLayout.restoreDataProvider(
          graph,
          backupTargetPcDP,
          yfiles.layout.PortCandidate.TARGET_PORT_CANDIDATE_COLLECTION_DP_KEY
        )
        FlowchartLayout.restoreDataProvider(
          graph,
          backupSourceGroupDP,
          yfiles.layout.PortConstraintKeys.SOURCE_GROUP_ID_DP_KEY
        )
        FlowchartLayout.restoreDataProvider(
          graph,
          backupTargetGroupDP,
          yfiles.layout.PortConstraintKeys.TARGET_GROUP_ID_DP_KEY
        )
        FlowchartLayout.restoreDataProvider(
          graph,
          backupNodeIdDP,
          yfiles.layout.LayoutKeys.NODE_ID_DP_KEY
        )
        restoreOriginalGraph(graph)
        removeCollinearBends(graph)
      }
    }

    /**
     * Configures the in-edge grouping.
     * @see {@link InEdgeGroupingConfigurator}
     */
    configureInEdgeGrouping(/** yfiles.layout.LayoutGraph */ graph) {
      const hasLayerIds = graph.getDataProvider(FlowchartTransformerStage.LAYER_ID_DP_KEY) !== null
      const precedingGroupingConfigurator = new InEdgeGroupingConfigurator(this)
      const succeedingGroupingConfigurator = new SucceedingLayersInEdgeGroupingConfigurator(this)
      const edgesToReverse = new yfiles.algorithms.EdgeList()
      const groupingLists = getGroupingLists(graph)
      groupingLists.forEach(groupingList => {
        if (groupingList === null || groupingList.isEmpty()) {
          return
        }
        if (hasLayerIds) {
          const layers = this.getInEdgesByLayer(graph, groupingList)
          precedingGroupingConfigurator.applyGrouping(layers[0], graph)
          succeedingGroupingConfigurator.applyGroupingWithReversedEdges(
            layers[1],
            graph,
            edgesToReverse
          )
        } else {
          const target = groupingList.firstEdge().target
          groupingList.forEach(edge => {
            this.targetGroupIds.set(edge, target)
          })
        }
      })

      edgesToReverse.forEach(edge => {
        graph.reverseEdge(edge)
        // Reverse the port candidate data if an original edge was reversed
        if (
          this.groupingDummiesMap.getInt(edge.source) === 0 ||
          this.groupingDummiesMap.getInt(edge.target) === 0
        ) {
          const spc = this.sourceCandidates.get(edge)
          this.sourceCandidates.set(edge, this.targetCandidates.get(edge))
          this.targetCandidates.set(edge, spc)
        }
      })
    }

    /**
     * Creates the configuration for the preferred edge directions.
     * This method creates source port candidates according
     * to the directions defined by the data provider for the key {@link FlowchartLayout#PREFERRED_DIRECTION_DP_KEY}.
     */
    configurePreferredEdgeDirections(/** yfiles.layout.LayoutGraph */ graph) {
      const directions = graph.getDataProvider(FlowchartLayout.PREFERRED_DIRECTION_DP_KEY)
      if (!directions) {
        return
      }
      graph.nodes.forEach(node => {
        let leftCount = 0
        let rightCount = 0

        node.outEdges.forEach(edge => {
          const dir = directions.getInt(edge)
          if (dir === FlowchartLayout.DIRECTION_LEFT_IN_FLOW) {
            leftCount++
          } else if (dir === FlowchartLayout.DIRECTION_RIGHT_IN_FLOW) {
            rightCount++
          }
          this.sourceCandidates.set(edge, this.getPortCandidateCollection(dir))
        })
        if (leftCount <= 1 && rightCount <= 1) {
          return
        }

        // If there is more than one edge to the left or right side,
        // set less restrictive candidates to allow nicer images.
        node.outEdges.forEach(edge => {
          const dir = directions.getInt(edge)
          if (
            dir === FlowchartLayout.DIRECTION_LEFT_IN_FLOW ||
            dir === FlowchartLayout.DIRECTION_RIGHT_IN_FLOW
          ) {
            this.sourceCandidates.set(
              edge,
              this.getPortCandidateCollection(FlowchartLayout.DIRECTION_FLATWISE)
            )
          }
        })
      })
    }

    /**
     * Returns the in-edges of the given node grouped by layer.
     * @return {yfiles.algorithms.EdgeList[][]} the in-edges of the given node grouped by layer. the first array
     *   contains edges from preceding layers, the second array edges from succeeding layers.
     */
    getInEdgesByLayer(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.algorithms.EdgeList */ groupedInEdges
    ) {
      const hasLayerIds = !!graph.getDataProvider(FlowchartTransformerStage.LAYER_ID_DP_KEY)
      groupedInEdges.sort(new LayerIndexComparer(this, hasLayerIds))
      const referenceLayer = this.getLayerId(groupedInEdges.firstEdge().target)
      const precedingLayers = []
      const succeedingLayers = []
      let previousLayer = -1
      groupedInEdges.forEach(edge => {
        const layer = this.getLayerId(edge.source)
        const layers = layer <= referenceLayer ? precedingLayers : succeedingLayers
        if (layer !== previousLayer) {
          layers.push(new yfiles.algorithms.EdgeList())
          previousLayer = layer
        }
        layers[layers.length - 1].push(edge)
      })
      succeedingLayers.reverse()
      return [precedingLayers, succeedingLayers]
    }

    /**
     * Returns the layer Id for the given node, either from the registered data provider or from the internal dummy node
     * layer Id map.
     * @return {number}
     */
    getLayerId(/** yfiles.algorithms.Node */ node) {
      return this.groupingDummiesMap.getInt(node) !== 0
        ? this.dummyLayerIds.getInt(node)
        : node.graph.getDataProvider(FlowchartTransformerStage.LAYER_ID_DP_KEY).getInt(node)
    }

    /**
     * Returns a collection of port candidate for the given direction.
     * @param {number} direction
     * one of hte direction constants in <FlowchartLayout/>.
     * @return {yfiles.collections.ICollection} a collection of port candidate for the given direction.
     */
    getPortCandidateCollection(/** number */ direction) {
      const collection = []
      if ((direction & FlowchartLayout.DIRECTION_WITH_THE_FLOW) !== 0) {
        collection.push(this.getPortCandidateSingleton(yfiles.layout.PortDirections.WITH_THE_FLOW))
      }
      if ((direction & FlowchartLayout.DIRECTION_AGAINST_THE_FLOW) !== 0) {
        collection.push(
          this.getPortCandidateSingleton(yfiles.layout.PortDirections.AGAINST_THE_FLOW)
        )
      }
      if ((direction & FlowchartLayout.DIRECTION_LEFT_IN_FLOW) !== 0) {
        collection.push(this.getPortCandidateSingleton(yfiles.layout.PortDirections.LEFT_IN_FLOW))
      }
      if ((direction & FlowchartLayout.DIRECTION_RIGHT_IN_FLOW) !== 0) {
        collection.push(this.getPortCandidateSingleton(yfiles.layout.PortDirections.RIGHT_IN_FLOW))
      }
      return yfiles.collections.List.fromArray(collection)
    }

    /**
     * Returns a single candidate for the given direction.
     * @return {yfiles.layout.PortCandidate}
     */
    getPortCandidateSingleton(/** number */ direction) {
      switch (
        FlowchartTransformerStage.getDirectionForLayoutOrientation(
          this.layoutOrientation,
          direction
        )
      ) {
        case yfiles.layout.PortDirections.NORTH:
          return this.northCandidate
        case yfiles.layout.PortDirections.SOUTH:
          return this.southCandidate
        case yfiles.layout.PortDirections.EAST:
          return this.eastCandidate
        case yfiles.layout.PortDirections.WEST:
          return this.westCandidate
        default:
          return null
      }
    }

    /**
     * DataProvider key to register layer indices for each node.
     * @type {Object}
     */
    static get LAYER_ID_DP_KEY() {
      return 'FlowchartTransformerStage.LAYER_ID_DP_KEY'
    }

    /**
     * DataProvider key to mark nodes as grouping dummies.
     * @type {Object}
     */
    static get GROUPING_NODES_DP_KEY() {
      return 'FlowchartTransformerStage.GROUPING_NODES_DP_KEY'
    }

    /**
     * Constant which describes a node in the preceding layer.
     * @type {number}
     */
    static get NODE_TYPE_PRECEDING_LAYER() {
      return 1
    }

    /**
     * Constant which describes a node in the succeeding layer.
     * @type {number}
     */
    static get NODE_TYPE_SUCCEEDING_LAYER() {
      return 2
    }

    /**
     * Returns whether or not the given node is a grouping dummy created by this class.
     * @return {boolean}
     */
    static isGroupingDummy(
      /** yfiles.algorithms.Graph */ graph,
      /** yfiles.algorithms.Node */ node
    ) {
      const provider = graph.getDataProvider(FlowchartTransformerStage.GROUPING_NODES_DP_KEY)
      return provider && provider.getInt(node) > 0
    }

    /**
     * Returns the absolute port candidate direction for the given direction with respect to the layout orientation of
     * this layout stage.
     * @return {number}
     */
    static getDirectionForLayoutOrientation(
      /** number */ layoutOrientation,
      /** number */ direction
    ) {
      if (layoutOrientation === yfiles.layout.LayoutOrientation.TOP_TO_BOTTOM) {
        switch (direction) {
          case yfiles.layout.PortDirections.AGAINST_THE_FLOW:
            return yfiles.layout.PortDirections.NORTH
          case yfiles.layout.PortDirections.WITH_THE_FLOW:
            return yfiles.layout.PortDirections.SOUTH
          case yfiles.layout.PortDirections.LEFT_IN_FLOW:
            return yfiles.layout.PortDirections.EAST
          case yfiles.layout.PortDirections.RIGHT_IN_FLOW:
            return yfiles.layout.PortDirections.WEST
          default:
            return -1
        }
      } else {
        switch (direction) {
          case yfiles.layout.PortDirections.AGAINST_THE_FLOW:
            return yfiles.layout.PortDirections.WEST
          case yfiles.layout.PortDirections.WITH_THE_FLOW:
            return yfiles.layout.PortDirections.EAST
          case yfiles.layout.PortDirections.LEFT_IN_FLOW:
            return yfiles.layout.PortDirections.NORTH
          case yfiles.layout.PortDirections.RIGHT_IN_FLOW:
            return yfiles.layout.PortDirections.SOUTH
          default:
            return -1
        }
      }
    }

    /**
     * Returns the last element of the given array.
     * @return {yfiles.algorithms.EdgeList}
     */
    static getLast(/** yfiles.algorithms.EdgeList[] */ edgeLists) {
      return edgeLists[edgeLists.length - 1]
    }

    /**
     * Returns a new list that contains the elements of <code>c1.addAll(c2)</code>.
     * @return {yfiles.algorithms.YList}
     */
    static createCombinedList(
      /** yfiles.collections.ICollection */ c1,
      /** yfiles.collections.ICollection */ c2
    ) {
      const yList = new yfiles.algorithms.YList(c1)
      yList.addAll(c2)
      return yList
    }
  }

  /**
   * DataProvider which returns the data holder itself for each graph item as an id.
   */
  class IdProvider extends yfiles.algorithms.DataProviderAdapter {
    get(dataHolder) {
      return dataHolder
    }
  }

  /**
   * DataProvider which returns either the value stored in the backup-provider if it exists or else the value in the
   * provider.
   */
  class NodeIdDataProvider extends yfiles.algorithms.DataProviderAdapter {
    constructor(backupNodeIdDP, provider) {
      super()
      this.backupNodeIdDP = backupNodeIdDP
      this.provider = provider
    }

    get(dataHolder) {
      if (this.backupNodeIdDP && this.backupNodeIdDP.get(dataHolder)) {
        return this.backupNodeIdDP.get(dataHolder)
      }
      return this.provider.get(dataHolder)
    }
  }

  /**
   * Comparer which uses the index of the edges' target nodes as an order.
   */
  class EdgeIndexComparer extends yfiles.lang.Class(yfiles.collections.IComparer) {
    compare(o1, o2) {
      const index1 = o1.target.$index
      const index2 = o2.target.$index
      if (index1 === index2) {
        return 0
      }
      return index1 < index2 ? -1 : 1
    }
  }

  /**
   * Comparer which uses the layer index of the edges' source nodes as an order.
   */
  class LayerIndexComparer extends yfiles.lang.Class(yfiles.collections.IComparer) {
    constructor(/** FlowchartTransformerStage */ enclosing, /** boolean */ hasLayerIds) {
      super()
      this.enclosing = enclosing
      this.hasLayerIds = hasLayerIds
    }

    compare(o1, o2) {
      const n1 = o1.source
      const n2 = o2.source
      if (this.hasLayerIds && this.enclosing.getLayerId(n1) !== this.enclosing.getLayerId(n2)) {
        return this.enclosing.getLayerId(n1) < this.enclosing.getLayerId(n2) ? -1 : 1
      }
      return 0
    }
  }

  /**
   * Creates the grouping dummy structure.
   */
  class InEdgeGroupingConfigurator {
    constructor(/** FlowchartTransformerStage */ enclosing) {
      this.enclosing = enclosing
    }

    /**
     * Creates the complete grouping dummy structure.
     * @see {@link InEdgeGroupingConfigurator#createBus}
     * @see {@link InEdgeGroupingConfigurator#createGrouping}
     */
    applyGrouping(
      /** yfiles.algorithms.EdgeList[] */ layers,
      /** yfiles.layout.LayoutGraph */ graph
    ) {
      if (layers.length > 0) {
        const neighborLayerNode = FlowchartTransformerStage.getLast(layers).firstEdge().source
        const nonBusEdges = this.createBus(graph, layers)
        if (nonBusEdges.size === 1) {
          this.handleSingleEdgeGrouping(nonBusEdges.firstEdge(), graph)
        } else if (nonBusEdges.size > 1) {
          this.createGrouping(nonBusEdges, neighborLayerNode, graph)
        }
      }
    }

    /**
     * Returns the grouping type of this class.
     * @return {number}
     * {@link FlowchartTransformerStage#NODE_TYPE_PRECEDING_LAYER}.
     */
    getGroupingType() {
      return FlowchartTransformerStage.NODE_TYPE_PRECEDING_LAYER
    }

    /**
     * Changes the given edge to the given nodes, and allows subclasses to reverses its direction if required.
     */
    changeEdge(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.algorithms.Edge */ edge /** yfiles.algorithms.Node */,
      source,
      /** yfiles.algorithms.Node */ target
    ) {
      graph.changeEdge(edge, source, target)
    }

    /**
     * Sets the grouping Id of the given edge to the appropriate grouping Id data acceptor.
     * By default, this are target
     * group Ids.
     */
    setGroupId(/** yfiles.algorithms.Edge */ edge, id) {
      this.enclosing.targetGroupIds.set(edge, id)
    }

    /**
     * Creates a port candidates for an edge connecting two bus dummy nodes.
     */
    createBusPortCandidate(
      /** yfiles.algorithms.Edge */ edge,
      /** yfiles.layout.LayoutGraph */ graph
    ) {
      this.enclosing.sourceCandidates.set(
        edge,
        this.createStrongPortCandidate(
          edge,
          true,
          yfiles.layout.PortDirections.WITH_THE_FLOW,
          graph
        )
      )
    }

    /**
     * Creates a bus structure to group incoming edges of a single node <code>t</code>.
     * These edges have to come from
     * different layers which are all either in preceding layers or succeeding layers.
     * The bus is created iteratively from the most distant to the nearest layer as long as there is at most one
     * neighbor in the layer. For edges from preceding layers, in each layer except the most distant one, the bus
     * consists of a new dummy node <code>d</code>, the original edge which is changed from <code>(v, t)</code> to
     * <code>(v, d)</code>, one incoming edge from the previous more distant layer and a new dummy edge to the next
     * less
     * layer or <code>t</code>. For succeeding layers, the direction of the dummy edges is reversed, that is, the edge
     * direction is always from lower layer index to higher layer index.
     * @param {yfiles.layout.LayoutGraph} graph the graph.
     * @param {yfiles.algorithms.EdgeList[]} layers all relevant edges grouped by source layer and sorted from distant
     *   layer to near.
     * @return {yfiles.algorithms.EdgeList}
     */
    createBus(/** yfiles.layout.LayoutGraph */ graph, /** yfiles.algorithms.EdgeList[] */ layers) {
      const target = layers[0].firstEdge().target
      const nonSingletonLayerEdges = new yfiles.algorithms.EdgeList()
      const unfinishedEdges = new yfiles.algorithms.EdgeList()
      layers.forEach(layer => {
        // maybe we should also check if a singleton node is connected to too many such buses
        if (nonSingletonLayerEdges.isEmpty() && layer.size === 1) {
          const edge = layer.firstEdge()
          if (unfinishedEdges.isEmpty()) {
            unfinishedEdges.addLast(edge)
          } else {
            const layerDummy = this.createDummyNode(
              graph,
              this.getGroupingType(),
              this.enclosing.getLayerId(edge.source)
            )
            // Change unfinished edges to the dummy node
            unfinishedEdges.forEach(e => {
              this.changeEdge(graph, e, e.source, layerDummy)
              if (unfinishedEdges.size > 1) {
                this.setGroupId(e, layerDummy)
              }
            })
            unfinishedEdges.clear()

            // Create a new edge from the dummy to the target
            const e = graph.createEdge(layerDummy, target)
            unfinishedEdges.addLast(e)
            this.createBusPortCandidate(e, graph)
            // Handle this layer's edge
            if (FlowchartLayout.isStraightBranch(graph, edge)) {
              unfinishedEdges.addLast(edge)
            } else {
              this.changeEdge(graph, edge, edge.source, layerDummy)
            }
          }
        } else {
          nonSingletonLayerEdges.addAll(layer)
        }
      })
      if (!unfinishedEdges.isEmpty()) {
        nonSingletonLayerEdges.addAll(unfinishedEdges)
      }
      return nonSingletonLayerEdges
    }

    /**
     * Handles the grouping of only one edge.
     */
    handleSingleEdgeGrouping(
      /** yfiles.algorithms.Edge */ edge,
      /** yfiles.layout.LayoutGraph */ graph
    ) {
      this.enclosing.targetCandidates.set(
        edge,
        this.createStrongPortCandidate(
          edge,
          false,
          yfiles.layout.PortDirections.AGAINST_THE_FLOW,
          graph
        )
      )
    }

    /**
     * Creates an edge grouping for the given <code>nonBusEdges</code>.
     * Since grouping works best if the sources of all
     * nonBusEdges are in the neighboring layer, this method splits edges from more distant layers by adding dummy nodes
     * in the neighboring layer.
     */
    createGrouping(
      /** yfiles.algorithms.EdgeList */ nonBusEdges,
      /** yfiles.algorithms.Node */ neighborLayerNode,
      /** yfiles.layout.LayoutGraph */ graph
    ) {
      const nodeIds = graph.getDataProvider(yfiles.layout.LayoutKeys.NODE_ID_DP_KEY)
      const groupId = nodeIds.get(nonBusEdges.firstEdge().target)
      nonBusEdges.forEach(edge => {
        this.setGroupId(edge, groupId)
        this.enclosing.targetCandidates.set(
          edge,
          this.createStrongPortCandidate(
            edge,
            false,
            yfiles.layout.PortDirections.AGAINST_THE_FLOW,
            graph
          )
        )
      })
    }

    /**
     * Creates a dummy node, sets its layer Id and registers it in the dummy marker map.
     * @return {yfiles.algorithms.Node}
     */
    createDummyNode(
      /** yfiles.layout.LayoutGraph */ graph,
      /** number */ groupingType,
      /** number */ layerId
    ) {
      const dummyNode = graph.createNode()
      this.enclosing.groupingDummiesMap.setInt(dummyNode, groupingType)
      this.enclosing.dummyLayerIds.setInt(dummyNode, layerId)
      if (this.enclosing.groupNodeIdWrapper !== null) {
        this.enclosing.groupNodeIdWrapper.map.set(dummyNode, dummyNode)
      }
      graph.setSize(dummyNode, DUMMY_NODE_SIZE, DUMMY_NODE_SIZE)
      return dummyNode
    }

    /**
     * Creates a singleton collection containing one port candidate for the specified end node of the given edge.
     * @return {yfiles.collections.ICollection}
     */
    createStrongPortCandidate(
      /** yfiles.algorithms.Edge */ edge,
      /** boolean */ source,
      /** number */ dir,
      /** yfiles.layout.LayoutGraph */ graph
    ) {
      const nl = graph.getLayout(source ? edge.source : edge.target)
      const direction = FlowchartTransformerStage.getDirectionForLayoutOrientation(
        this.enclosing.layoutOrientation,
        dir
      )
      let point
      switch (direction) {
        case yfiles.layout.PortDirections.NORTH:
        default:
          point = new yfiles.algorithms.YPoint(0.0, -0.5 * nl.height)
          break
        case yfiles.layout.PortDirections.SOUTH:
          point = new yfiles.algorithms.YPoint(0.0, 0.5 * nl.height)
          break
        case yfiles.layout.PortDirections.EAST:
          point = new yfiles.algorithms.YPoint(0.5 * nl.width, 0.0)
          break
        case yfiles.layout.PortDirections.WEST:
          point = new yfiles.algorithms.YPoint(-0.5 * nl.width, 0.0)
          break
      }
      return yfiles.collections.List.fromArray([
        yfiles.layout.PortCandidate.createCandidate(point.x, point.y, direction)
      ])
    }
  }

  /**
   * An {@link InEdgeGroupingConfigurator} for edges to succeeding layers.
   * Its main difference is the creation of a same
   * layer dummy node. Apart from that, this class has to set other port candidate directions and reverses some edges.
   */
  class SucceedingLayersInEdgeGroupingConfigurator extends InEdgeGroupingConfigurator {
    constructor(/** FlowchartTransformerStage */ enclosing) {
      super(enclosing)
      this.enclosing = enclosing
      this.edgesToReverse = null
    }

    /**
     * Creates the complete grouping dummy structure.
     * This class stores all edges that must be reversed after the
     * creation of all dummy structures in the given list.
     * Use this method instead of {@link SucceedingLayersInEdgeGroupingConfigurator#applyGrouping}.
     * @see {@link InEdgeGroupingConfigurator#createBus}
     * @see {@link SucceedingLayersInEdgeGroupingConfigurator#createGrouping}
     */
    applyGroupingWithReversedEdges(
      /** yfiles.algorithms.EdgeList[] */ layers,
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.algorithms.EdgeList */ edgesToReverse
    ) {
      try {
        this.edgesToReverse = edgesToReverse
        super.applyGrouping(layers, graph)
      } finally {
        this.edgesToReverse = null
      }
    }

    /**
     * This method must not be called directly since it omits the required list for edges to reverse.
     * @see Overrides {@link InEdgeGroupingConfigurator#applyGrouping}
     */
    applyGrouping(
      /** yfiles.algorithms.EdgeList[] */ layers,
      /** yfiles.layout.LayoutGraph */ graph
    ) {
      if (!this.edgesToReverse) {
        throw new Error('Collection of edges to reverse is not set.')
      }
      super.applyGrouping(layers, graph)
    }

    /**
     * Returns the grouping type of this class.
     * @return {number}
     * {@link FlowchartTransformerStage#NODE_TYPE_SUCCEEDING_LAYER}.
     * @see Overrides {@link InEdgeGroupingConfigurator#getGroupingType}
     */
    getGroupingType() {
      return FlowchartTransformerStage.NODE_TYPE_SUCCEEDING_LAYER
    }

    /**
     * Changes the given edge to the given nodes and reverses its direction.
     * @see Overrides {@link InEdgeGroupingConfigurator#changeEdge}
     */
    changeEdge(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.algorithms.Edge */ edge /** yfiles.algorithms.Node */,
      source,
      /** yfiles.algorithms.Node */ target
    ) {
      super.changeEdge(graph, edge, source, target)
      this.edgesToReverse.addLast(edge)
    }

    /**
     * Sets the grouping Id of the given edge to the appropriate grouping Id data acceptor.
     * This are source group Ids.
     * @see Overrides {@link InEdgeGroupingConfigurator#setGroupId}
     */
    setGroupId(/** yfiles.algorithms.Edge */ edge, id) {
      this.enclosing.sourceGroupIds.set(edge, id)
    }

    /**
     * Creates a port candidate for an edge connecting two bus dummy nodes.
     * @see Overrides {@link InEdgeGroupingConfigurator#createBusPortCandidate}
     */
    createBusPortCandidate(
      /** yfiles.algorithms.Edge */ edge,
      /** yfiles.layout.LayoutGraph */ graph
    ) {
      this.enclosing.targetCandidates.set(
        edge,
        this.createStrongPortCandidate(
          edge,
          true,
          yfiles.layout.PortDirections.AGAINST_THE_FLOW,
          graph
        )
      )
    }

    /**
     * Creates a strong North candidate and reverses the edge if it comes from a dummy.
     * @see Overrides {@link InEdgeGroupingConfigurator#handleSingleEdgeGrouping}
     */
    handleSingleEdgeGrouping(
      /** yfiles.algorithms.Edge */ edge,
      /** yfiles.layout.LayoutGraph */ graph
    ) {
      if (this.enclosing.groupingDummiesMap.getInt(edge.source) > 0) {
        this.edgesToReverse.addLast(edge)
      }
      this.enclosing.targetCandidates.set(
        edge,
        this.createStrongPortCandidate(
          edge,
          false,
          yfiles.layout.PortDirections.AGAINST_THE_FLOW,
          graph
        )
      )
    }

    /**
     * Creates an edge grouping for the given <code>nonBusEdges</code>.
     * Since grouping works best if the sources of all
     * nonBusEdges are in the neighboring layer, this method splits edges from more distant layers by adding dummy nodes
     * in the neighboring layer.
     * @see Overrides {@link InEdgeGroupingConfigurator#createGrouping}
     */
    createGrouping(
      /** yfiles.algorithms.EdgeList */ nonBusEdges,
      /** yfiles.algorithms.Node */ neighborLayerNode,
      /** yfiles.layout.LayoutGraph */ graph
    ) {
      this.prepareForGrouping(nonBusEdges, graph)
      const target = nonBusEdges.firstEdge().target
      const groupId = graph.getDataProvider(yfiles.layout.LayoutKeys.NODE_ID_DP_KEY).get(target)
      const neighborLayerIndex = this.enclosing.getLayerId(neighborLayerNode)
      nonBusEdges.forEach(edge => {
        let /** yfiles.algorithms.Edge */ groupingEdge
        if (neighborLayerIndex === this.enclosing.getLayerId(edge.source)) {
          groupingEdge = edge
        } else {
          const layerDummy = this.createDummyNode(graph, this.getGroupingType(), neighborLayerIndex)
          this.changeEdge(graph, edge, edge.source, layerDummy)
          groupingEdge = graph.createEdge(layerDummy, target)
        }
        this.edgesToReverse.addLast(groupingEdge)
        this.setGroupId(groupingEdge, groupId)
        this.enclosing.sourceCandidates.set(
          groupingEdge,
          this.createStrongPortCandidate(
            groupingEdge,
            false,
            yfiles.layout.PortDirections.WITH_THE_FLOW,
            graph
          )
        )
      })
    }

    /**
     * Creates a same layer dummy node for nicer grouping.
     */
    prepareForGrouping(
      /** yfiles.algorithms.EdgeList */ nonBusEdges,
      /** yfiles.layout.LayoutGraph */ graph
    ) {
      const originalTarget = nonBusEdges.firstEdge().target
      const target = this.createDummyNode(
        graph,
        this.getGroupingType(),
        this.enclosing.getLayerId(originalTarget)
      )
      const sameLayerEdge = graph.createEdge(originalTarget, target)
      this.enclosing.sourceCandidates.set(
        sameLayerEdge,
        this.createStrongPortCandidate(
          sameLayerEdge,
          true,
          yfiles.layout.PortDirections.AGAINST_THE_FLOW,
          graph
        )
      )
      nonBusEdges.forEach(edge => {
        graph.changeEdge(edge, edge.source, target)
      })
    }
  }

  /**
   * A two-stage data provider which returns the value of <code>map.get(key)</code> if the key is contained in the given
   * map, and <code>fallback.get(key)</code> otherwise.
   */
  class HashedDataProviderWrapper extends yfiles.lang.Class(yfiles.algorithms.IDataProvider) {
    constructor(
      /** yfiles.algorithms.Maps */ map,
      /** yfiles.algorithms.IDataProvider */ fallback
    ) {
      super()
      this.$map = map
      this.$fallback = fallback
    }

    /**
     * Returns the map which is wrapped by this DataProvider.
     * @return {yfiles.algorithms.IMap}
     */
    get map() {
      return this.$map
    }

    /**
     * returns
     * @type {yfiles.algorithms.IDataProvider}
     */
    get fallback() {
      return this.$fallback
    }

    /**
     * Returns an object value associated with the given data holder.
     * This method may throw an Error.
     * @see Specified by {@link yfiles.algorithms.IDataProvider#get}.
     * @return {Object}
     */
    get(dataHolder) {
      return this.map.has(dataHolder) ? this.map.get(dataHolder) : this.fallback.get(dataHolder)
    }

    /**
     * Returns an integer value associated with the given data holder.
     * This method may throw an Error.
     * @see Specified by {@link yfiles.algorithms.IDataProvider#getInt}.
     * @return {number}
     */
    getInt(dataHolder) {
      return this.map.has(dataHolder)
        ? Number.parseInt(this.map.get(dataHolder))
        : this.fallback.getInt(dataHolder)
    }

    /**
     * Returns a double value associated with the given data holder.
     * This method may throw an Error.
     * @see Specified by {@link yfiles.algorithms.IDataProvider#getNumber}.
     * @return {number}
     */
    getNumber(dataHolder) {
      return this.map.has(dataHolder)
        ? Number.parseFloat(this.map.get(dataHolder))
        : this.fallback.getNumber(dataHolder)
    }

    /**
     * Returns a boolean value associated with the given data holder.
     * This method may throw an Error.
     * @see Specified by {@link yfiles.algorithms.IDataProvider#getBoolean}.
     * @return {boolean}
     */
    getBoolean(dataHolder) {
      return this.map.has(dataHolder)
        ? !!this.map.get(dataHolder)
        : this.fallback.getBoolean(dataHolder)
    }
  }

  /**
   * Returns an array of edge lists, each of which contains all edges with the same group Id and the same target node.
   * @return {yfiles.algorithms.EdgeList[]}
   */
  function getGroupingLists(/** yfiles.layout.LayoutGraph */ graph) {
    const groupIdDP = graph.getDataProvider(yfiles.layout.PortConstraintKeys.TARGET_GROUP_ID_DP_KEY)
    // Partition edges according to group Id
    const idToListsMap = yfiles.algorithms.Maps.createHashMap()
    graph.edges.forEach(edge => {
      const id = groupIdDP.get(edge)
      if (id) {
        if (idToListsMap.has(id)) {
          /** @type {yfiles.collections.ICollection} */ idToListsMap.get(id).addLast(edge)
        } else {
          const list = new yfiles.algorithms.EdgeList(edge)
          idToListsMap.set(id, list)
        }
      }
    })
    // Divide the group Id partitions according to edge target nodes
    const targetGroupLists = []
    idToListsMap.values.forEach(groupList => {
      // Sort the edges according to target nodes such that edges with the same target have consecutive indices
      groupList.sort(new EdgeIndexComparer())
      // Add edges to lists and start a new list whenever a new target is found
      let /** yfiles.algorithms.EdgeList */ targetGroupList = null
      groupList.forEach(edge => {
        if (!targetGroupList || !edge.target.equals(targetGroupList.firstEdge().target)) {
          targetGroupList = new yfiles.algorithms.EdgeList()
          targetGroupLists.push(targetGroupList)
        }
        targetGroupList.addLast(edge)
      })
    })
    return targetGroupLists
  }

  /**
   * Restores the original graph by changing all edges to their original nodes and removing all dummy nodes.
   */
  function restoreOriginalGraph(/** yfiles.layout.LayoutGraph */ graph) {
    const groupingDummiesDP = graph.getDataProvider(FlowchartTransformerStage.GROUPING_NODES_DP_KEY)
    if (groupingDummiesDP === null) {
      return
    }
    graph.removeDataProvider(FlowchartTransformerStage.GROUPING_NODES_DP_KEY)
    new yfiles.algorithms.NodeList(graph.getNodeCursor()).forEach(node => {
      let outPath
      const groupingDummyId = groupingDummiesDP.getInt(node)
      if (groupingDummyId === FlowchartTransformerStage.NODE_TYPE_PRECEDING_LAYER) {
        const outEdge = node.firstOutEdge
        outPath = graph.getPathList(outEdge)
        outPath.set(0, graph.getCenter(node))
        new yfiles.algorithms.EdgeList(node.getInEdgeCursor()).forEach(edge => {
          const inPath = graph.getPathList(edge)
          inPath.popLast()
          graph.changeEdge(edge, edge.source, outEdge.target)
          graph.setPath(edge, FlowchartTransformerStage.createCombinedList(inPath, outPath))
        })
        graph.removeNode(node)
      } else if (groupingDummyId === FlowchartTransformerStage.NODE_TYPE_SUCCEEDING_LAYER) {
        const inEdge = node.firstInEdge
        const inEdgeFromOriginal = groupingDummiesDP.getInt(inEdge.source) === 0
        const inPath = graph.getPathList(inEdge)
        inPath.set(inPath.size - 1, graph.getCenter(node))
        new yfiles.algorithms.EdgeList(node.getOutEdgeCursor()).forEach(edge => {
          const outEdgeFromOriginal = groupingDummiesDP.getInt(edge.target) === 0
          outPath = graph.getPathList(edge)
          outPath.pop()
          graph.changeEdge(edge, inEdge.source, edge.target)
          const combinedPath = FlowchartTransformerStage.createCombinedList(inPath, outPath)
          if (inEdgeFromOriginal && outEdgeFromOriginal) {
            // change the edge to its original targets -> reverse the edge direction
            graph.reverseEdge(edge)
            combinedPath.reverse()
          }
          makeOrthogonal(combinedPath)
          graph.setPath(edge, combinedPath)
        })
        graph.removeNode(node)
      }
    })
  }

  /**
   * Fixes the orthogonality first and last segment of the edge path.
   */
  function makeOrthogonal(/** yfiles.algorithms.YList */ combinedPath) {
    if (combinedPath.size < 2) {
      return
    }
    const firstCell = combinedPath.firstCell
    const p1 = firstCell.info
    const p2 = firstCell.succ().info
    if (!isOrthogonal(p1, p2)) {
      const p3 = makeOrthogonalSegment(p2, p1)
      combinedPath.insertAfter(p3, firstCell)
    }
    const lastCell = combinedPath.lastCell
    const q1 = lastCell.pred().info
    const q2 = lastCell.info
    if (!isOrthogonal(q1, q2)) {
      const q3 = makeOrthogonalSegment(q1, q2)
      combinedPath.insertBefore(q3, lastCell)
    }
  }

  /**
   * Fixes the orthogonality the segment between the given points.
   * @return {yfiles.algorithms.YPoint}
   * */
  function makeOrthogonalSegment(
    /** yfiles.algorithms.YPoint */ p1,
    /** yfiles.algorithms.YPoint */ p2
  ) {
    return Math.abs(p1.x - p2.x) < Math.abs(p1.y - p2.y)
      ? new yfiles.algorithms.YPoint(p2.x, p1.y)
      : new yfiles.algorithms.YPoint(p1.x, p2.y)
  }

  /**
   * Checks whether or not the segment between the given points is orthogonal.
   * @return {boolean}
   */
  function isOrthogonal(/** yfiles.algorithms.YPoint */ p1, /** yfiles.algorithms.YPoint */ p2) {
    return Math.abs(p1.x - p2.x) < 0.01 || Math.abs(p1.y - p2.y) < 0.01
  }

  /**
   * Removes all collinear bends.
   */
  function removeCollinearBends(/** yfiles.layout.LayoutGraph */ graph) {
    // do not remove bends of self-loops
    const selfLoopHider = new yfiles.algorithms.LayoutGraphHider(graph)
    selfLoopHider.hideSelfLoops()
    const collinearBendsStage = new yfiles.layout.RemoveCollinearBendsStage()
    collinearBendsStage.removeStraightOnly = false
    collinearBendsStage.applyLayout(graph)
    selfLoopHider.unhideAll()
  }

  /**
   * Returns the hierarchic layout algorithm that is set as core layout of the given layout stage or <code>null</code>
   * if none is set.
   * @return {yfiles.hierarchic.HierarchicLayout}
   */
  function getHierarchicCoreLayout(/** yfiles.layout.ILayoutStage */ stage) {
    const coreLayout = stage.coreLayout
    if (coreLayout instanceof yfiles.hierarchic.HierarchicLayout) {
      return coreLayout
    } else if (yfiles.layout.ILayoutStage.isInstance(coreLayout)) {
      return getHierarchicCoreLayout(coreLayout)
    }
    return null
  }

  /**
   * ImplicitNumericConversion, ObjectEquality
   */
  class FlowchartPortOptimizer extends yfiles.hierarchic.PortConstraintOptimizerBase {
    constructor(layoutOrientation) {
      super()
      this.alignmentCalculator = new FlowchartAlignmentCalculator()
      this.pcListOptimizer = new yfiles.hierarchic.PortCandidateOptimizer()
      this.$layoutOrientation = layoutOrientation
    }

    /**
     * Gets the layout orientation.
     * This setting is necessary to correctly interpret the values provided by the {@link yfiles.layout.PortCandidate}s
     * since the {@link yfiles.layout.OrientationLayout} cannot automatically adjust these values.
     * Value: a predefined orientation constant
     * <b>Param:</b> a predefined orientation constant
     * <b>Range.all:</b>
     * <b>Default:</b>
     * {@link yfiles.layout.LayoutOrientation#TOP_TO_BOTTOM} The layout orientation is top-to-bottom.
     * <b>Important:</b>
     * <b>Return:</b> a predefined orientation constant
     * @see {@link yfiles.layout.MultiStageLayout#layoutOrientation}
     * @type {yfiles.layout.LayoutOrientation}
     */
    get layoutOrientation() {
      return this.$layoutOrientation
    }

    /**
     * Sets the layout orientation.
     * This setting is necessary to correctly interpret the values provided by the {@link yfiles.layout.PortCandidate}s
     * since the {@link yfiles.layout.OrientationLayout} cannot automatically adjust these values.
     * Value: a predefined orientation constant
     * <b>Param:</b> a predefined orientation constant
     * <b>Range.all:</b>
     * <b>Default:</b>
     * {@link yfiles.layout.LayoutOrientation#TOP_TO_BOTTOM} The layout orientation is top-to-bottom.
     * <b>Important:</b>
     * <b>Return:</b> a predefined orientation constant
     * @see {@link yfiles.layout.MultiStageLayout#layoutOrientation}
     * @type {yfiles.layout.LayoutOrientation}
     */
    set layoutOrientation(/** yfiles.layout.LayoutOrientation */ value) {
      this.$layoutOrientation = value
    }

    /**
     * Assigns new temporary port constraints after the layering information has been determined.
     * @param {yfiles.layout.LayoutGraph} graph the input graph
     * @param {yfiles.hierarchic.ILayers} layers
     * the given {@link yfiles.hierarchic.ILayers} instance
     * @param {yfiles.hierarchic.ILayoutDataProvider} ldp
     * the {@link yfiles.hierarchic.ILayoutDataProvider} containing information about the elements
     * @param {yfiles.hierarchic.IItemFactory} itemFactory
     * the {@link yfiles.hierarchic.IItemFactory} to set the temporary port constraints with
     * @see {@link yfiles.hierarchic.IItemFactory#setTemporaryPortConstraint}
     * @see Specified by {@link yfiles.hierarchic.IPortConstraintOptimizer#optimizeAfterLayering}.
     */
    optimizeAfterLayering(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.hierarchic.ILayers */ layers,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp,
      /** yfiles.hierarchic.IItemFactory */ itemFactory
    ) {
      this.pcListOptimizer.optimizeAfterLayering(graph, layers, ldp, itemFactory)
    }

    /**
     * Assigns new temporary port constraints after the sequence of the nodes has been determined.
     * @param {yfiles.layout.LayoutGraph} graph the input graph
     * @param {yfiles.hierarchic.ILayers} layers
     * the given {@link yfiles.hierarchic.ILayers} instance
     * @param {yfiles.hierarchic.ILayoutDataProvider} ldp
     * the {@link yfiles.hierarchic.ILayoutDataProvider} containing information about the elements
     * @param {yfiles.hierarchic.IItemFactory} itemFactory
     * the {@link yfiles.hierarchic.IItemFactory} to set the temporary port constraints with
     * @see {@link yfiles.hierarchic.IItemFactory#setTemporaryPortConstraint}
     * @see Specified by {@link yfiles.hierarchic.IPortConstraintOptimizer#optimizeAfterSequencing}.
     */
    optimizeAfterSequencing(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.hierarchic.ILayers */ layers,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp,
      /** yfiles.hierarchic.IItemFactory */ itemFactory
    ) {
      super.optimizeAfterSequencing(graph, layers, ldp, itemFactory)
      const edgePriority = yfiles.algorithms.Maps.createHashedEdgeMap()
      const nodeAlignment = yfiles.algorithms.Maps.createHashedNodeMap()
      this.alignmentCalculator.determineAlignment(graph, ldp, nodeAlignment, edgePriority)
      this.optimizeForAlignment(graph, ldp, itemFactory, nodeAlignment, edgePriority)
      optimizeMessageNodes(graph, ldp, itemFactory)
    }

    /**
     * Assigns new temporary port constraints to a given node of the graph after the order of the nodes in each layer
     * has been determined.
     *
     * More precisely, it is called after the sequence of the nodes has been determined.
     *
     * Incoming and outgoing edges are sorted using {@link yfiles.algorithms.Comparers.IPartialOrder} instances which
     * define the preferred ordering of the incoming and outgoing edges from left to right. To sort collections
     * according to a {@link yfiles.algorithms.Comparers.IPartialOrder} instance, an appropriate method like
     * {@link yfiles.algorithms.Comparers#sort} or {@link yfiles.algorithms.YList#sort} must be used.
     *
     * <b>Note:</b> In this phase, it is not allowed to create back-loops, i.e., incoming edges must not connect to the
     * south
     * (i.e., bottom) side and outgoing edges must not connect to the north (i.e., top) side of a node.
     * @param {yfiles.algorithms.Node} node the original node to set temporary port constraints
     * @param {yfiles.collections.IComparer} inEdgeOrder
     * a given {@link yfiles.algorithms.Comparers.IPartialOrder} instance for incoming edges
     * @param {yfiles.collections.IComparer} outEdgeOrder
     * a given {@link yfiles.algorithms.Comparers.IPartialOrder} instance for outgoing edges
     * @param {yfiles.layout.LayoutGraph} graph the input graph
     * @param {yfiles.hierarchic.ILayoutDataProvider} ldp
     * the {@link yfiles.hierarchic.ILayoutDataProvider} implementation which provides access to the
     *   {@link yfiles.hierarchic.INodeData} and
     * {@link yfiles.hierarchic.IEdgeData} instances
     * @param {yfiles.hierarchic.IItemFactory} itemFactory
     * the {@link yfiles.hierarchic.IItemFactory factory} that sets the temporary port constraints
     * @see {@link yfiles.hierarchic.PortConstraintOptimizerBase#optimizeAfterSequencing}
     */
    optimizeAfterSequencingForSingleNode(
      /** yfiles.algorithms.Node */ node /** yfiles.collections.IComparer */,
      inEdgeOrder,
      /** yfiles.collections.IComparer */ outEdgeOrder,
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp,
      /** yfiles.hierarchic.IItemFactory */ itemFactory
    ) {
      // set EAST or WEST temporary constraints for the same layer edges
      node.edges.forEach(edge => {
        if (FlowchartPortOptimizer.isTemporarySameLayerEdge(edge, ldp)) {
          const preferredSide = FlowchartPortOptimizer.getPreferredSideForTemporarySameLayerEdge(
            edge,
            ldp
          )
          itemFactory.setTemporaryPortConstraint(
            edge,
            node.equals(edge.source),
            yfiles.layout.PortConstraint.create(preferredSide)
          )
        }
      })
      // choose final temporary constraint for all non-assigned flatwise edges
      this.optimizeFlatwiseEdges(node, true, outEdgeOrder, ldp, itemFactory)
      this.optimizeFlatwiseEdges(node, false, inEdgeOrder, ldp, itemFactory)
    }

    /**
     * Chooses the final port constraint for all non-assigned flatwise edges.
     */
    optimizeFlatwiseEdges(
      /** yfiles.algorithms.Node */ node,
      /** boolean */ source /** yfiles.collections.IComparer */,
      edgeOrder,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp,
      /** yfiles.hierarchic.IItemFactory */ itemFactory
    ) {
      const flatwiseEdges = yfiles.algorithms.Maps.createHashSet()
      const centralEdges = new yfiles.algorithms.EdgeList()
      const edges = source ? node.outEdges : node.inEdges
      edges.forEach(edge => {
        const edgeData = ldp.getEdgeData(edge)
        const constraint = source ? edgeData.sourcePortConstraint : edgeData.targetPortConstraint
        const candidates = source ? edgeData.sourcePortCandidates : edgeData.targetPortCandidates
        if (constraint && (constraint.atEast || constraint.atWest)) {
          return
        }
        if (
          FlowchartPortOptimizer.isFlatwiseCandidateCollection(candidates, this.layoutOrientation)
        ) {
          flatwiseEdges.add(edge)
        } else {
          centralEdges.add(edge)
        }
      })
      if (flatwiseEdges.size === 0) {
        return
      }
      centralEdges.addAll(flatwiseEdges)
      centralEdges.sort(edgeOrder)
      centralEdges.forEach((edge, i) => {
        if (flatwiseEdges.some(flatwiseEdge => flatwiseEdge === edge)) {
          const side =
            i < ((centralEdges.size / 2) | 0)
              ? yfiles.layout.PortSide.WEST
              : yfiles.layout.PortSide.EAST
          itemFactory.setTemporaryPortConstraint(
            edge,
            source,
            yfiles.layout.PortConstraint.create(side)
          )
        }
      })
    }

    /**
     * Optimizes port constraints considering nodes that are aligned.
     */
    optimizeForAlignment(
      /** yfiles.layout.LayoutGraph */ graph /** yfiles.hierarchic.ILayoutDataProvider */,
      ldp,
      /** yfiles.hierarchic.IItemFactory */ itemFactory,
      /** yfiles.algorithms.IDataProvider */ node2AlignWith /** yfiles.algorithms.IDataProvider */,
      edge2Length
    ) {
      graph.nodes.forEach(node => {
        if (!this.alignmentCalculator.isSpecialNode(graph, node, ldp) || node.degree < 2) {
          return
        }
        node.sortOutEdges(new PositionEdgeComparer(false, ldp))
        node.sortInEdges(new PositionEdgeComparer(true, ldp))
        const criticalInEdge = getCriticalInEdge(node, node2AlignWith, edge2Length)
        const criticalOutEdge = getCriticalOutEdge(node, node2AlignWith, edge2Length)
        if (criticalInEdge !== null || criticalOutEdge !== null) {
          optimizeWithCriticalEdges(node, ldp, itemFactory, criticalInEdge, criticalOutEdge)
        } else if (node.degree > 2) {
          optimizeWithoutCriticalEdges(node, ldp, itemFactory)
        }
        // Parallel edges of the critical edges which have a port constraints at the left or right side must have a
        // port constraint for the same side at the opposite end, too. Otherwise, such an edge gets many bends and
        // may even destroy the alignment.
        if (criticalInEdge !== null) {
          node.inEdges.forEach(edge => {
            if (criticalInEdge !== edge && criticalInEdge.source === edge.source) {
              const pc = ldp.getEdgeData(edge).targetPortConstraint
              if (FlowchartPortOptimizer.isFlatwisePortConstraint(pc)) {
                itemFactory.setTemporaryPortConstraint(
                  edge,
                  true,
                  yfiles.layout.PortConstraint.create(pc.side)
                )
              }
            }
          })
        }
        if (criticalOutEdge !== null) {
          node.outEdges.forEach(edge => {
            if (criticalOutEdge !== edge && criticalOutEdge.target === edge.target) {
              const pc = ldp.getEdgeData(edge).sourcePortConstraint
              if (FlowchartPortOptimizer.isFlatwisePortConstraint(pc)) {
                itemFactory.setTemporaryPortConstraint(
                  edge,
                  true,
                  yfiles.layout.PortConstraint.create(pc.side)
                )
              }
            }
          })
        }
      })
    }

    /**
     * Constant which describes a left lane alignment.
     * @type {number}
     */
    static get LANE_ALIGNMENT_LEFT() {
      return 0
    }

    /**
     * Constant which describes a right lane alignment.
     * @type {number}
     */
    static get LANE_ALIGNMENT_RIGHT() {
      return 1
    }

    /**
     * Constant which describes a low priority.
     * @type {number}
     */
    static get PRIORITY_LOW() {
      return 1
    }

    /**
     * Constant which describes a normal priority.
     * @type {number}
     */
    static get PRIORITY_BASIC() {
      return 3
    }

    /**
     * Constant which describes a high priority.
     * @type {number}
     */
    static get PRIORITY_HIGH() {
      return 5000
    }

    /**
     * DataProvider key to provide a node alignment.
     * @type {string}
     */
    static get NODE_TO_ALIGN_DP_KEY() {
      return 'y.layout.hierarchic.incremental.SimlexNodePlacer.NODE_TO_ALIGN_WITH'
    }

    /**
     * Checks whether or not the given edge is a temporarily inserted same layer edge.
     * @return {boolean}
     */
    static isTemporarySameLayerEdge(
      /** yfiles.algorithms.Edge */ edge,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp
    ) {
      return FlowchartPortOptimizer.isTemporarySameLayerNode(edge.target, ldp)
    }

    /**
     * Checks whether or not the given node is a dummy node connected to temporary same layer edges.
     * @return {boolean}
     */
    static isTemporarySameLayerNode(
      /** yfiles.algorithms.Node */ node,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp
    ) {
      return node.inDegree === 2 && node.outDegree === 0 && ldp.getNodeData(node) === null
    }

    /**
     * Returns the preferred side where the given same layer edge should connect to it source/target node.
     * @return {number}
     */
    static getPreferredSideForTemporarySameLayerEdge(
      /** yfiles.algorithms.Edge */ edge,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp
    ) {
      const originalEdge = ldp.getEdgeData(edge).associatedEdge
      const source = originalEdge.source.equals(edge.source)
      const sData = ldp.getNodeData(originalEdge.source)
      const tData = ldp.getNodeData(originalEdge.target)
      if (sData.position < tData.position) {
        return source ? yfiles.layout.PortSide.EAST : yfiles.layout.PortSide.WEST
      }
      return !source ? yfiles.layout.PortSide.EAST : yfiles.layout.PortSide.WEST
    }

    /**
     * Returns all same layer edges in the graph.
     * @return {yfiles.algorithms.EdgeList}
     */
    static getAllSameLayerEdges(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp
    ) {
      const sameLayerEdges = new yfiles.algorithms.EdgeList()
      const edge2Seen = yfiles.algorithms.Maps.createHashedEdgeMap()
      graph.nodes.forEach(node => {
        const nData = ldp.getNodeData(node)
        for (let cell = nData.firstSameLayerEdgeCell; cell !== null; cell = cell.succ()) {
          const sameLayerEdge = /** @type {yfiles.algorithms.Edge} */ cell.info
          const opposite = sameLayerEdge.opposite(node)
          if (!edge2Seen.getBoolean(sameLayerEdge) && graph.contains(opposite)) {
            sameLayerEdges.addLast(sameLayerEdge)
            edge2Seen.setBoolean(sameLayerEdge, true)
          }
        }
      })
      return sameLayerEdges
    }

    /**
     * Returns all same layer edges connected to the given node.
     * @return {yfiles.algorithms.EdgeList}
     */
    static getSameLayerEdges(
      /** yfiles.algorithms.Node */ node,
      /** boolean */ left,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp
    ) {
      const nData = ldp.getNodeData(node)
      const nPos = nData.position
      const result = new yfiles.algorithms.EdgeList()
      for (let cell = nData.firstSameLayerEdgeCell; cell !== null; cell = cell.succ()) {
        const sameLayerEdge = /** @type {yfiles.algorithms.Edge} */ cell.info
        const other = sameLayerEdge.opposite(node)
        const otherPos = ldp.getNodeData(other).position
        if ((left && otherPos < nPos) || (!left && otherPos > nPos)) {
          result.addLast(sameLayerEdge)
        }
      }
      return result
    }

    /**
     * Checks whether or not the given node connects to at least one same layer edge.
     * @return {boolean}
     */
    static hasSameLayerEdge(
      /** yfiles.algorithms.Node */ n,
      /** boolean */ left,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp
    ) {
      return !FlowchartPortOptimizer.getSameLayerEdges(n, left, ldp).isEmpty()
    }

    /**
     * Checks whether or not the given port constraint is flatwise (east or west).
     * @return {boolean}
     */
    static isFlatwisePortConstraint(/** yfiles.layout.PortConstraint */ portConstraint) {
      return portConstraint && (portConstraint.atEast || portConstraint.atWest)
    }

    /**
     * Checks whether or not the given candidates contain candidates to the east and west.
     * @return {boolean}
     */
    static isFlatwiseCandidateCollection(
      /** yfiles.collections.ICollection */ portCandidates /** number */,
      layoutOrientation
    ) {
      if (!portCandidates) {
        return false
      }
      let containsEast = false
      let containsWest = false
      portCandidates.forEach(pc => {
        const direction = pc.getDirectionForLayoutOrientation(layoutOrientation)
        if (!containsEast && (yfiles.layout.PortDirections.EAST & direction) !== 0) {
          containsEast = true
        }
        if (!containsWest && (yfiles.layout.PortDirections.WEST & direction) !== 0) {
          containsWest = true
        }
      })
      return containsEast && containsWest
    }

    /**
     * Checks whether or not the given edge is goes from a higher layer back to a lower layer.
     * @return {boolean}
     */
    static isBackEdge(
      /** yfiles.algorithms.Edge */ edge,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp
    ) {
      return ldp.getEdgeData(edge).reversed
    }

    /**
     * Returns the original edge to the given (dummy) edge. If the edge is already an original edge, it is returned
     * itself.
     * @return {yfiles.algorithms.Edge}
     */
    static getOriginalEdge(
      /** yfiles.algorithms.Edge */ edge /** yfiles.hierarchic.ILayoutDataProvider */,
      ldp
    ) {
      const sData = ldp.getNodeData(edge.source)
      if (sData.type === yfiles.hierarchic.NodeDataType.BEND && sData.associatedEdge !== null) {
        return sData.associatedEdge
      }
      const tData = ldp.getNodeData(edge.target)
      if (tData.type === yfiles.hierarchic.NodeDataType.BEND && tData.associatedEdge !== null) {
        return tData.associatedEdge
      }
      return edge
    }

    /**
     * Returns the id of the swimlane to which the given node belongs. If the node is not assigned to any swimlane,
     * <code>-1</code> is returned.
     * @return {number}
     */
    static getSwimlaneId(
      /** yfiles.algorithms.Node */ node /** yfiles.hierarchic.ILayoutDataProvider */,
      ldp
    ) {
      const laneDesc = ldp.getNodeData(node).swimLaneDescriptor
      return laneDesc === null ? -1 : laneDesc.computedLaneIndex
    }

    /**
     * Checks whether the source node is assigned to a swimlane right of the target node's swimlane.
     * @return {boolean}
     */
    static isToLeftPartition(
      /** yfiles.algorithms.Node */ source,
      /** yfiles.algorithms.Node */ target,
      /** yfiles.hierarchic.ILayoutDataProvider */ layoutData
    ) {
      const sourceDesc = layoutData.getNodeData(source).swimLaneDescriptor
      const targetDesc = layoutData.getNodeData(target).swimLaneDescriptor
      return (
        sourceDesc !== targetDesc &&
        sourceDesc !== null &&
        targetDesc !== null &&
        sourceDesc.computedLaneIndex > targetDesc.computedLaneIndex
      )
    }

    /**
     * Checks whether the source node is assigned to a swimlane left of the target node's swimlane.
     * @return {boolean}
     */
    static isToRightPartition(
      /** yfiles.algorithms.Node */ source,
      /** yfiles.algorithms.Node */ target,
      /** yfiles.hierarchic.ILayoutDataProvider */ layoutData
    ) {
      const sourceDesc = layoutData.getNodeData(source).swimLaneDescriptor
      const targetDesc = layoutData.getNodeData(target).swimLaneDescriptor
      return (
        sourceDesc !== targetDesc &&
        sourceDesc !== null &&
        targetDesc !== null &&
        sourceDesc.computedLaneIndex < targetDesc.computedLaneIndex
      )
    }
  }

  /**
   * Compares edges between the same layers according to the position of the end nodes of the specified end.
   * Ties are
   * broken by the direction of the port constraints at the specified end, then at the opposite end, where WEST is first
   * and EAST is last.
   * Can be used, for example, to sort in- or out-edges of a specific node in the typical best way.
   */
  class PositionEdgeComparer extends yfiles.lang.Class(yfiles.collections.IComparer) {
    constructor(/** boolean */ source, /** yfiles.hierarchic.ILayoutDataProvider */ ldp) {
      super()
      this.sameLayerNodePositionComparer = new SameLayerNodePositionComparer(ldp)
      this.portConstraintComparer = new SingleSidePortConstraintComparer()
      this.source = source
      this.ldp = ldp
    }

    compare(o1, o2) {
      const e1 = /** @type {yfiles.algorithms.Edge} */ o1
      const e2 = /** @type {yfiles.algorithms.Edge} */ o2
      // compare positions at specified end
      const comparePos = this.sameLayerNodePositionComparer.compare(
        this.source ? e1.source : e1.target,
        this.source ? e2.source : e2.target
      )
      if (comparePos !== 0) {
        return comparePos
      }
      // compare constraints at specified end
      const compareConstraints = this.portConstraintComparer.compare(
        this.source
          ? this.ldp.getEdgeData(e1).sourcePortConstraint
          : this.ldp.getEdgeData(e1).targetPortConstraint,
        this.source
          ? this.ldp.getEdgeData(e2).sourcePortConstraint
          : this.ldp.getEdgeData(e2).targetPortConstraint
      )
      if (compareConstraints !== 0) {
        return compareConstraints
      }
      // compare constraints at opposite end
      return this.portConstraintComparer.compare(
        this.source
          ? this.ldp.getEdgeData(e1).targetPortConstraint
          : this.ldp.getEdgeData(e1).sourcePortConstraint,
        this.source
          ? this.ldp.getEdgeData(e2).targetPortConstraint
          : this.ldp.getEdgeData(e2).sourcePortConstraint
      )
    }
  }

  /**
   * Compares port constraints with respect to the upper or lower side of a node, that is WEST is first, EAST is last,
   * and NORTH and SOUTH are neutral elements in the middle.
   */
  class SingleSidePortConstraintComparer extends yfiles.lang.Class(yfiles.collections.IComparer) {
    compare(o1, o2) {
      const pc1 = /** @type {yfiles.layout.PortConstraint} */ o1
      const pc2 = /** @type {yfiles.layout.PortConstraint} */ o2
      // we use NORTH as neutral element since we care only about EST and WEST
      const b1 = pc1 ? pc1.side : yfiles.layout.PortSide.NORTH
      const b2 = pc2 ? pc2.side : yfiles.layout.PortSide.NORTH
      if (b1 === b2) {
        return 0
      }
      return b1 === yfiles.layout.PortSide.WEST || b2 === yfiles.layout.PortSide.EAST ? -1 : 1
    }
  }

  /**
   * Compares nodes in the same layer according to their positions.
   */
  class SameLayerNodePositionComparer extends yfiles.lang.Class(yfiles.collections.IComparer) {
    constructor(/** yfiles.hierarchic.ILayoutDataProvider */ ldp) {
      super()
      this.ldp = ldp
    }

    compare(o1, o2) {
      const position1 = this.ldp.getNodeData(o1).position
      const position2 = this.ldp.getNodeData(o2).position
      if (position1 === position2) {
        return 0
      }
      return position1 < position2 ? -1 : 1
    }
  }

  /**
   * Checks whether the given edge either connects to a strong or a flatwise port.
   * @return {boolean}
   */
  function isAtPreferredPort(
    /** yfiles.algorithms.Edge */ edge,
    /** boolean */ source,
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp
  ) {
    const e = FlowchartPortOptimizer.getOriginalEdge(edge, ldp)
    const edgeData = ldp.getEdgeData(e)
    const pc = source ? edgeData.sourcePortConstraint : edgeData.targetPortConstraint
    return pc && (pc.strong || pc.atEast || pc.atWest)
  }

  /**
   * Optimizes port constraints without considering node alignments (critical edges).
   */
  function optimizeWithoutCriticalEdges(
    /** yfiles.algorithms.Node */ node,
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp,
    /** yfiles.hierarchic.IItemFactory */ factory
  ) {
    if (node.outDegree > node.inDegree) {
      const firstOut = node.firstOutEdge
      const lastOut = node.lastOutEdge
      if (
        !FlowchartPortOptimizer.hasSameLayerEdge(node, true, ldp) &&
        !isAtPreferredPort(firstOut, true, ldp) &&
        (node.outDegree !== 2 ||
          !FlowchartPortOptimizer.isToRightPartition(firstOut.source, firstOut.target, ldp) ||
          FlowchartPortOptimizer.hasSameLayerEdge(node, false, ldp))
      ) {
        factory.setTemporaryPortConstraint(
          firstOut,
          true,
          yfiles.layout.PortConstraint.create(yfiles.layout.PortSide.WEST)
        )
      } else if (
        !FlowchartPortOptimizer.hasSameLayerEdge(node, false, ldp) &&
        !isAtPreferredPort(lastOut, true, ldp) &&
        (node.outDegree !== 2 ||
          !FlowchartPortOptimizer.isToLeftPartition(lastOut.source, lastOut.target, ldp))
      ) {
        factory.setTemporaryPortConstraint(
          lastOut,
          true,
          yfiles.layout.PortConstraint.create(yfiles.layout.PortSide.EAST)
        )
      }
    } else {
      const firstIn = node.firstInEdge
      const lastIn = node.lastInEdge
      if (
        !FlowchartPortOptimizer.hasSameLayerEdge(node, true, ldp) &&
        !isAtPreferredPort(firstIn, false, ldp) &&
        (node.degree !== 3 ||
          !FlowchartPortOptimizer.isToRightPartition(firstIn.target, firstIn.source, ldp) ||
          FlowchartPortOptimizer.hasSameLayerEdge(node, false, ldp))
      ) {
        factory.setTemporaryPortConstraint(
          firstIn,
          false,
          yfiles.layout.PortConstraint.create(yfiles.layout.PortSide.WEST)
        )
      } else if (
        !FlowchartPortOptimizer.hasSameLayerEdge(node, false, ldp) &&
        !isAtPreferredPort(lastIn, false, ldp) &&
        (node.degree !== 3 ||
          !FlowchartPortOptimizer.isToLeftPartition(lastIn.target, lastIn.source, ldp))
      ) {
        factory.setTemporaryPortConstraint(
          lastIn,
          false,
          yfiles.layout.PortConstraint.create(yfiles.layout.PortSide.EAST)
        )
      }
    }
  }

  /**
   * Optimizes port constraints considering node alignments (critical edges).
   */
  function optimizeWithCriticalEdges(
    /** yfiles.algorithms.Node */ node,
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp,
    /** yfiles.hierarchic.IItemFactory */ factory,
    /** yfiles.algorithms.Edge */ criticalInEdge /** yfiles.algorithms.Edge */,
    criticalOutEdge
  ) {
    const firstIn = node.firstInEdge
    const firstOut = node.firstOutEdge
    const lastIn = node.lastInEdge
    const lastOut = node.lastOutEdge
    if (node.degree === 3 && node.outDegree === 2 && criticalOutEdge === null) {
      // Special case: the only in-edge is critical and there are two free out-edges
      if (
        (!FlowchartPortOptimizer.isToRightPartition(firstOut.source, firstOut.target, ldp) &&
          FlowchartPortOptimizer.isBackEdge(firstOut, ldp)) ||
        FlowchartPortOptimizer.isToLeftPartition(firstOut.source, firstOut.target, ldp)
      ) {
        setOptimizedPortConstraint(firstOut, true, yfiles.layout.PortSide.WEST, ldp, factory)
        if (
          (!FlowchartPortOptimizer.isToLeftPartition(lastOut.source, lastOut.target, ldp) &&
            FlowchartPortOptimizer.isBackEdge(lastOut, ldp)) ||
          FlowchartPortOptimizer.isToRightPartition(lastOut.source, lastOut.target, ldp)
        ) {
          setOptimizedPortConstraint(lastOut, true, yfiles.layout.PortSide.EAST, ldp, factory)
        }
      } else {
        setOptimizedPortConstraint(lastOut, true, yfiles.layout.PortSide.EAST, ldp, factory)
      }
    } else if (node.degree === 3 && node.inDegree === 2 && criticalInEdge === null) {
      // Special case: the only out-edge is critical and there are two free in-edges
      if (
        (!FlowchartPortOptimizer.isToRightPartition(firstIn.target, firstIn.source, ldp) &&
          FlowchartPortOptimizer.isBackEdge(firstIn, ldp)) ||
        FlowchartPortOptimizer.isToLeftPartition(firstIn.target, firstIn.source, ldp)
      ) {
        setOptimizedPortConstraint(firstIn, false, yfiles.layout.PortSide.WEST, ldp, factory)
        if (
          (!FlowchartPortOptimizer.isToRightPartition(lastIn.target, lastIn.source, ldp) &&
            FlowchartPortOptimizer.isBackEdge(lastIn, ldp)) ||
          FlowchartPortOptimizer.isToLeftPartition(lastIn.target, lastIn.source, ldp)
        ) {
          setOptimizedPortConstraint(lastIn, true, yfiles.layout.PortSide.EAST, ldp, factory)
        }
      } else {
        setOptimizedPortConstraint(lastIn, true, yfiles.layout.PortSide.EAST, ldp, factory)
      }
    } else if (
      criticalInEdge === null ||
      (node.outDegree > node.inDegree && criticalOutEdge !== null)
    ) {
      if (!FlowchartPortOptimizer.hasSameLayerEdge(node, true, ldp)) {
        if (firstOut !== criticalOutEdge) {
          setOptimizedPortConstraint(firstOut, true, yfiles.layout.PortSide.WEST, ldp, factory)
        } else if (firstIn !== null && firstIn !== criticalInEdge && node.inDegree > 1) {
          setOptimizedPortConstraint(firstIn, false, yfiles.layout.PortSide.WEST, ldp, factory)
        }
      }
      if (!FlowchartPortOptimizer.hasSameLayerEdge(node, false, ldp)) {
        if (lastOut !== criticalOutEdge) {
          setOptimizedPortConstraint(lastOut, true, yfiles.layout.PortSide.EAST, ldp, factory)
        } else if (lastIn !== null && lastIn !== criticalInEdge && node.inDegree > 1) {
          setOptimizedPortConstraint(lastIn, false, yfiles.layout.PortSide.EAST, ldp, factory)
        }
      }
    } else {
      if (!FlowchartPortOptimizer.hasSameLayerEdge(node, true, ldp)) {
        if (firstIn !== criticalInEdge) {
          setOptimizedPortConstraint(firstIn, false, yfiles.layout.PortSide.WEST, ldp, factory)
        } else if (firstOut !== null && firstOut !== criticalOutEdge && node.outDegree > 1) {
          setOptimizedPortConstraint(firstOut, true, yfiles.layout.PortSide.WEST, ldp, factory)
        }
      }
      if (!FlowchartPortOptimizer.hasSameLayerEdge(node, false, ldp)) {
        if (lastIn !== criticalInEdge) {
          setOptimizedPortConstraint(lastIn, false, yfiles.layout.PortSide.EAST, ldp, factory)
        } else if (lastOut !== null && lastOut !== criticalOutEdge && node.outDegree > 1) {
          setOptimizedPortConstraint(lastOut, true, yfiles.layout.PortSide.EAST, ldp, factory)
        }
      }
    }
  }

  /**
   * Sets a temporary port constraint when the given edge doesn't already connect to a preferred port.
   */
  function setOptimizedPortConstraint(
    /** yfiles.algorithms.Edge */ edge,
    /** boolean */ source,
    /** number */ direction,
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp,
    /** yfiles.hierarchic.IItemFactory */ factory
  ) {
    if (!isAtPreferredPort(edge, source, ldp)) {
      factory.setTemporaryPortConstraint(
        edge,
        source,
        yfiles.layout.PortConstraint.create(direction)
      )
    }
  }

  /**
   * Special handling for messages (always attach them to the side of nodes).
   */
  function optimizeMessageNodes(
    /** yfiles.layout.LayoutGraph */ graph,
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp,
    /** yfiles.hierarchic.IItemFactory */ factory
  ) {
    const edges = new yfiles.algorithms.EdgeList(graph.getEdgeCursor())
    edges.splice(FlowchartPortOptimizer.getAllSameLayerEdges(graph, ldp))
    edges.forEach(e => {
      const original = FlowchartPortOptimizer.getOriginalEdge(e, ldp)
      const sourceLaneId = FlowchartPortOptimizer.getSwimlaneId(original.source, ldp)
      const targetLaneId = FlowchartPortOptimizer.getSwimlaneId(original.target, ldp)
      if (FlowchartElements.isMessageFlow(graph, e) && sourceLaneId !== targetLaneId) {
        if (
          ldp.getNodeData(e.source).type === yfiles.hierarchic.NodeDataType.NORMAL &&
          FlowchartElements.isActivity(graph, e.source)
        ) {
          factory.setTemporaryPortConstraint(
            e,
            true,
            yfiles.layout.PortConstraint.create(
              sourceLaneId < targetLaneId
                ? yfiles.layout.PortSide.EAST
                : yfiles.layout.PortSide.WEST
            )
          )
        }
        if (
          ldp.getNodeData(e.target).type === yfiles.hierarchic.NodeDataType.NORMAL &&
          FlowchartElements.isActivity(graph, e.target)
        ) {
          factory.setTemporaryPortConstraint(
            e,
            false,
            yfiles.layout.PortConstraint.create(
              sourceLaneId < targetLaneId
                ? yfiles.layout.PortSide.WEST
                : yfiles.layout.PortSide.EAST
            )
          )
        }
      }
    })
  }

  /**
   * Returns an in-edge for the given node which comes from the node it is aligned with.
   * If several such edges exist,
   * the edge with the highest length is returned.
   * @return {yfiles.algorithms.Edge}
   */
  function getCriticalInEdge(
    /** yfiles.algorithms.Node */ node,
    /** yfiles.algorithms.IDataProvider */ node2AlignWith,
    /** yfiles.algorithms.IDataProvider */ edge2Length
  ) {
    let /** yfiles.algorithms.Edge */ bestEdge = null
    node.inEdges.forEach(edge => {
      if (
        node2AlignWith.get(node) === edge.source &&
        (bestEdge === null || edge2Length.getNumber(bestEdge) < edge2Length.getInt(edge))
      ) {
        bestEdge = edge
      }
    })
    return bestEdge
  }

  /**
   * Returns an out-edge for the given node which goes to the node it is aligned with.
   * If several such edges exist, the
   * edge with the highest length is returned.
   * @return {yfiles.algorithms.Edge}
   */
  function getCriticalOutEdge(
    /** yfiles.algorithms.Node */ node,
    /** yfiles.algorithms.IDataProvider */ node2AlignWith,
    /** yfiles.algorithms.IDataProvider */ edge2Length
  ) {
    let /** yfiles.algorithms.Edge */ bestEdge = null
    node.outEdges.forEach(edge => {
      if (
        node2AlignWith.get(edge.target) === node &&
        (bestEdge === null || edge2Length.getNumber(bestEdge) < edge2Length.getInt(edge))
      ) {
        bestEdge = edge
      }
    })
    return bestEdge
  }

  const WEIGHT_DEFAULT_EDGE = 3
  const WEIGHT_DEFAULT_EDGE_IN_SUBPROCESS = 5
  const WEIGHT_MESSAGE_FLOW = 3
  const WEIGHT_ASSOCIATION = 2
  const MIN_LENGTH_DEFAULT_EDGE = 1
  const MIN_LENGTH_FLATWISE_BRANCH = 0
  const MIN_LENGTH_MESSAGE_FLOW = 0
  const MIN_LENGTH_ASSOCIATION = 0
  const CYCLE_WEIGHT_BACKEDGE = 1.0
  const CYCLE_WEIGHT_NON_BACKEDGE = 5.0

  /**
   * Customized layering for flowcharts.
   */
  class FlowchartLayerer extends yfiles.lang.Class(yfiles.hierarchic.ILayerer) {
    // Be careful: due to the handling of edges attaching to group nodes the degree of "degree-one" nodes may be > 1.
    // We are interested in nodes with degree one in the initial graph.

    constructor() {
      super()
      this.$assignStartNodesToLeftOrTop = false
      this.$allowFlatwiseDefaultFlow = false
    }

    /**
     * Returns whether or not start nodes are assigned at the top or to the left of the layout.
     * @type {boolean}
     */
    get assignStartNodesToLeftOrTop() {
      return this.$assignStartNodesToLeftOrTop
    }

    /**
     * Sets whether or not start nodes are assigned at the top or to the left of the layout.
     * @type {boolean}
     */
    set assignStartNodesToLeftOrTop(/** boolean */ value) {
      this.$assignStartNodesToLeftOrTop = value
    }

    /**
     * Returns whether or not a flatwise default flow is allowed.
     * @type {boolean}
     */
    get allowFlatwiseDefaultFlow() {
      return this.$allowFlatwiseDefaultFlow
    }

    /**
     * Sets whether or not a flatwise default flow is allowed.
     * @type {boolean}
     */
    set allowFlatwiseDefaultFlow(/** boolean */ value) {
      this.$allowFlatwiseDefaultFlow = value
    }

    assignLayers(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.hierarchic.ILayers */ layers,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp
    ) {
      const reversedEdges = reverseCycles(graph)
      // assign weights/min length to edges
      const hider = new yfiles.algorithms.LayoutGraphHider(graph)
      const minLength = graph.createEdgeMap()
      const node2Layer = graph.createNodeMap()
      const weight = graph.createEdgeMap()
      try {
        // transform graph
        const dummies = this.insertDummyEdges(graph, hider, weight, minLength)
        dummies.addLast(this.insertSuperRoot(graph, weight, minLength))
        // assign layers
        yfiles.algorithms.RankAssignments.simplex(graph, node2Layer, weight, minLength)
        // undo graph transformation
        dummies.forEach(dummy => {
          graph.removeNode(dummy)
        })
        hider.unhideAll()
        reversedEdges.forEach(edge => {
          graph.reverseEdge(edge)
        })

        // special handling for some degree 1 nodes (draw the incident edge as same layer edge)
        graph.nodes.forEach(node => {
          if (isDegreeOneNode(node, ldp)) {
            handleDegreeOneNode(node, graph, node2Layer, ldp)
          }
        })
        // build result data structure
        const layerCount = normalize(graph, node2Layer)
        for (let i = 0; i < layerCount; i++) {
          layers.insert(yfiles.hierarchic.LayerType.NORMAL, i)
        }
        graph.nodes.forEach(node => {
          const layer = node2Layer.getInt(node)
          layers.getLayer(layer).add(node)
        })
      } finally {
        // dispose
        graph.disposeEdgeMap(weight)
        graph.disposeEdgeMap(minLength)
        graph.disposeNodeMap(node2Layer)
      }
    }

    /**
     * Inserts dummy edges to support the flowchart layering.
     * @return {yfiles.algorithms.NodeList}
     */
    insertDummyEdges(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.algorithms.LayoutGraphHider */ hider,
      /** yfiles.algorithms.IDataAcceptor */ weight,
      /** yfiles.algorithms.IDataAcceptor */ minLength
    ) {
      const nodeTypeSet = !!graph.getDataProvider(FlowchartElements.NODE_TYPE_DP_KEY)
      const parentNodeIdDP = graph.getDataProvider(yfiles.layout.GroupingKeys.PARENT_NODE_ID_DP_KEY)
      const preferredDirectionDP = graph.getDataProvider(FlowchartLayout.PREFERRED_DIRECTION_DP_KEY)
      const groupingNodesDP = graph.getDataProvider(FlowchartTransformerStage.GROUPING_NODES_DP_KEY)
      const targetGroupIdDP = graph.getDataProvider(
        yfiles.layout.PortConstraintKeys.TARGET_GROUP_ID_DP_KEY
      )
      const outEdgeBranchTypes = graph.createNodeMap()
      graph.nodes.forEach(node => {
        let type = 0
        node.outEdges.forEach(edge => {
          type |= preferredDirectionDP.getInt(edge)
        })
        outEdgeBranchTypes.setInt(node, type)
      })
      const dummies = new yfiles.algorithms.NodeList()
      const edges = graph.getEdgeArray()
      edges.forEach(edge => {
        let dummyEdge2
        let dummyEdge1
        let dummyNode
        switch (getType(graph, edge)) {
          case FlowchartElements.EDGE_TYPE_MESSAGE_FLOW: {
            dummyNode = graph.createNode()
            dummies.addLast(dummyNode)
            dummyEdge1 = graph.createEdge(edge.source, dummyNode)
            weight.setInt(dummyEdge1, WEIGHT_MESSAGE_FLOW)
            minLength.setInt(dummyEdge1, MIN_LENGTH_MESSAGE_FLOW)
            dummyEdge2 = graph.createEdge(edge.target, dummyNode)
            weight.setInt(dummyEdge2, WEIGHT_MESSAGE_FLOW)
            minLength.setInt(dummyEdge2, MIN_LENGTH_MESSAGE_FLOW)
            hider.hide(edge)
            break
          }
          case FlowchartElements.EDGE_TYPE_ASSOCIATION: {
            dummyNode = graph.createNode()
            dummies.addLast(dummyNode)
            dummyEdge1 = graph.createEdge(edge.source, dummyNode)
            weight.setInt(dummyEdge1, WEIGHT_ASSOCIATION)
            minLength.setInt(dummyEdge1, MIN_LENGTH_ASSOCIATION)
            dummyEdge2 = graph.createEdge(edge.target, dummyNode)
            weight.setInt(dummyEdge2, WEIGHT_ASSOCIATION)
            minLength.setInt(dummyEdge2, MIN_LENGTH_ASSOCIATION)
            hider.hide(edge)
            break
          }
          default: {
            weight.setInt(
              edge,
              isContainedInSubProcess(edge, graph, parentNodeIdDP, nodeTypeSet)
                ? WEIGHT_DEFAULT_EDGE_IN_SUBPROCESS
                : WEIGHT_DEFAULT_EDGE
            )
            if (
              isFlatwiseConnectorGroupingEdge(groupingNodesDP, edge) &&
              !FlowchartLayout.isStraightBranch(preferredDirectionDP, edge)
            ) {
              minLength.setInt(edge, MIN_LENGTH_FLATWISE_BRANCH)
            } else if (isFirstGroupingEdgeToSucceedingLayers(groupingNodesDP, edge)) {
              minLength.setInt(edge, MIN_LENGTH_FLATWISE_BRANCH)
            } else if (
              !this.$allowFlatwiseDefaultFlow ||
              !FlowchartLayout.isFlatwiseBranch(preferredDirectionDP, edge) ||
              containsOnlyFlatwise(outEdgeBranchTypes.getInt(edge.target)) ||
              isValueSet(targetGroupIdDP, edge)
            ) {
              minLength.setInt(edge, MIN_LENGTH_DEFAULT_EDGE)
            } else {
              minLength.setInt(edge, MIN_LENGTH_FLATWISE_BRANCH)
            }
            break
          }
        }
      })
      return dummies
    }

    /**
     * Inserts a super root to guarantee that graph is connected.
     * @return {yfiles.algorithms.Node}
     */
    insertSuperRoot(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.algorithms.IDataAcceptor */ weight,
      /** yfiles.algorithms.IDataAcceptor */ minLength
    ) {
      const superRoot = graph.createNode()
      graph.nodes.forEach(node => {
        if (!node.equals(superRoot) && node.inDegree === 0) {
          const dummyEdge = graph.createEdge(superRoot, node)
          weight.setInt(
            dummyEdge,
            this.$assignStartNodesToLeftOrTop && FlowchartElements.isStartEvent(graph, node)
              ? 100
              : 0
          )
          minLength.setInt(dummyEdge, 0)
        }
      })
      return superRoot
    }
  }

  /**
   * Reverses the edges in a circle.
   * @return {yfiles.algorithms.EdgeList}
   */
  function reverseCycles(/** yfiles.layout.LayoutGraph */ graph) {
    // we only consider edges of type sequence flow
    const hider = new yfiles.algorithms.LayoutGraphHider(graph)
    graph.edges.forEach(e => {
      if (getType(graph, e) !== FlowchartElements.EDGE_TYPE_SEQUENCE_FLOW) {
        hider.hide(e)
      }
    })
    const edge2Weight = graph.createEdgeMap()
    const cyclingEdges = graph.createEdgeMap()
    let /** yfiles.algorithms.EdgeList */ reversedEdges
    try {
      // try to identify backedges and assign lower weights to them
      const coreNodes = new yfiles.algorithms.NodeList()
      graph.nodes.forEach(node => {
        if (node.inDegree === 0) {
          coreNodes.addLast(node)
        }
      })
      const node2Depth = graph.createNodeMap()
      try {
        yfiles.algorithms.Bfs.getLayers(graph, coreNodes, true, node2Depth)
        graph.edges.forEach(edge => {
          if (node2Depth.getInt(edge.source) > node2Depth.getInt(edge.target)) {
            // likely to be a back-edge
            edge2Weight.setNumber(edge, CYCLE_WEIGHT_BACKEDGE)
          } else {
            edge2Weight.setNumber(edge, CYCLE_WEIGHT_NON_BACKEDGE)
          }
        })
      } finally {
        graph.disposeNodeMap(node2Depth)
      }
      // find and remove cycles
      reversedEdges = new yfiles.algorithms.EdgeList()
      yfiles.algorithms.Cycles.findCycleEdges(graph, cyclingEdges, edge2Weight)

      graph.edges.forEach(e => {
        if (cyclingEdges.getBoolean(e)) {
          graph.reverseEdge(e)
          reversedEdges.addLast(e)
        }
      })
    } finally {
      graph.disposeEdgeMap(cyclingEdges)
      graph.disposeEdgeMap(edge2Weight)
      hider.unhideAll()
    }
    return reversedEdges
  }

  /**
   * Returns the type of the given edge.
   * @return {number}
   */
  function getType(/** yfiles.layout.LayoutGraph */ graph, /** yfiles.algorithms.Edge */ edge) {
    if (!FlowchartElements.isUndefined(graph, edge)) {
      return FlowchartElements.getType(graph, edge)
    }

    // special handling if constraint incremental layerer calls this layerer
    const originalEdgeDpKey =
      'y.layout.hierarchic.incremental.ConstraintIncrementalLayerer.ORIG_EDGES'
    const edge2OrigEdge = graph.getDataProvider(originalEdgeDpKey)
    if (edge2OrigEdge && edge2OrigEdge.get(edge)) {
      const realEdge = /** @type {yfiles.algorithms.Edge} */ edge2OrigEdge.get(edge)
      if (!FlowchartElements.isUndefined(realEdge.graph, realEdge)) {
        return FlowchartElements.getType(realEdge.graph, realEdge)
      }
    }
    return FlowchartElements.isAnnotation(graph, edge.source) ||
      FlowchartElements.isAnnotation(graph, edge.target)
      ? FlowchartElements.EDGE_TYPE_ASSOCIATION
      : FlowchartElements.EDGE_TYPE_SEQUENCE_FLOW
  }

  /**
   * Checks whether or not the edge's source and target node are contained in the same group node.
   */
  function isContainedInSubProcess(
    /** yfiles.algorithms.Edge */ edge,
    /** yfiles.layout.LayoutGraph */ graph,
    /** yfiles.algorithms.IDataProvider */ node2Parent,
    /** boolean */ considerNodeType
  ) {
    if (node2Parent === null) {
      return false
    }
    const sourceParent = /** @type {yfiles.algorithms.Node} */ node2Parent.get(edge.source)
    const targetParent = /** @type {yfiles.algorithms.Node} */ node2Parent.get(edge.target)
    return (
      sourceParent &&
      sourceParent.equals(targetParent) &&
      (!considerNodeType || FlowchartElements.isGroup(graph, sourceParent))
    )
  }

  /**
   * Returns whether or not the given node has a real degree of 1. This doesn't count dummy edges.
   * @return {boolean}
   */
  function isDegreeOneNode(
    /** yfiles.algorithms.Node */ n /** yfiles.hierarchic.ILayoutDataProvider */,
    ldp
  ) {
    let realDegree = 0
    for (let ec = n.getEdgeCursor(); ec.ok; ec.next()) {
      if (isNormalEdge(ldp.getEdgeData(ec.edge))) {
        realDegree++
        if (realDegree > 1) {
          return false
        }
      }
    }
    return realDegree === 1
  }

  /**
   * Assigns 1-degree nodes to layers.
   */
  function handleDegreeOneNode(
    /** yfiles.algorithms.Node */ node,
    /** yfiles.layout.LayoutGraph */ graph,
    /** yfiles.algorithms.INodeMap */ node2Layer,
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp
  ) {
    if (!FlowchartElements.isEvent(graph, node) || FlowchartElements.isStartEvent(graph, node)) {
      return
    }
    const realEdge = findIncidentRealEdge(ldp, node)
    if (realEdge === null) {
      return
    }
    const opposite = realEdge.opposite(node)
    let sameLayerEdgeCount = 0
    let oppositeOutDegree = 0
    let oppositeInDegree = 0
    opposite.outEdges.forEach(edge => {
      if (!edge.equals(realEdge) && isNormalEdge(ldp.getEdgeData(edge))) {
        const layerDiff = node2Layer.getInt(edge.source) - node2Layer.getInt(edge.target)
        if (layerDiff > 0) {
          oppositeInDegree++
        } else if (layerDiff === 0) {
          sameLayerEdgeCount++
        } else {
          oppositeOutDegree++
        }
      }
    })

    opposite.inEdges.forEach(edge => {
      if (!edge.equals(realEdge) && isNormalEdge(ldp.getEdgeData(edge))) {
        const layerDiff = node2Layer.getInt(edge.source) - node2Layer.getInt(edge.target)
        if (layerDiff > 0) {
          oppositeOutDegree++
        } else if (layerDiff === 0) {
          sameLayerEdgeCount++
        } else {
          oppositeInDegree++
        }
      }
    })

    if (
      (realEdge.target.equals(node) &&
        sameLayerEdgeCount < 2 &&
        oppositeOutDegree >= 1 &&
        oppositeInDegree <= 2) ||
      (realEdge.source.equals(node) &&
        sameLayerEdgeCount < 2 &&
        oppositeInDegree >= 1 &&
        oppositeOutDegree <= 2)
    ) {
      node2Layer.setInt(node, node2Layer.getInt(opposite))
    }
  }

  /**
   * Checks whether or not the given edge is a normal edge and no dummy edge.
   * @return {boolean}
   */
  function isNormalEdge(/** yfiles.hierarchic.IEdgeData */ eData) {
    return eData && eData.type === yfiles.hierarchic.EdgeDataType.NORMAL
  }

  /**
   * Returns the first original edge connected to the given node.
   * @return {yfiles.algorithms.Edge}
   */
  function findIncidentRealEdge(
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp,
    /** yfiles.algorithms.Node */ node
  ) {
    for (let ec = node.getEdgeCursor(); ec.ok; ec.next()) {
      const edge = ec.edge
      if (isNormalEdge(ldp.getEdgeData(edge))) {
        return edge
      }
    }
    return null
  }

  /**
   * Checks whether or not the given branch type describes only flatwise directions.
   * @return {boolean}
   */
  function containsOnlyFlatwise(/** number */ branchType) {
    return branchType !== 0 && (branchType & FlowchartLayout.DIRECTION_STRAIGHT) === 0
  }

  /**
   * Checks whether or not the given edge is a flatwise grouping edge.
   * @return {boolean}
   */
  function isFlatwiseConnectorGroupingEdge(
    /** yfiles.algorithms.IDataProvider */ groupingDummies,
    /** yfiles.algorithms.Edge */ edge
  ) {
    return (
      groupingDummies !== null &&
      ((edge.target.inDegree > 1 &&
        groupingDummies.getInt(edge.source) === 0 &&
        groupingDummies.getInt(edge.target) ===
          FlowchartTransformerStage.NODE_TYPE_PRECEDING_LAYER) ||
        (edge.source.outDegree > 1 &&
          groupingDummies.getInt(edge.target) === 0 &&
          groupingDummies.getInt(edge.source) ===
            FlowchartTransformerStage.NODE_TYPE_SUCCEEDING_LAYER))
    )
  }

  /**
   * Checks whether or not the given edge is the first grouping edge to a succeeding layer.
   * @return {boolean}
   */
  function isFirstGroupingEdgeToSucceedingLayers(
    /** yfiles.algorithms.IDataProvider */ groupingDummies,
    /** yfiles.algorithms.Edge */ edge
  ) {
    return (
      groupingDummies !== null &&
      groupingDummies.getInt(edge.source) === 0 &&
      groupingDummies.getInt(edge.target) === FlowchartTransformerStage.NODE_TYPE_SUCCEEDING_LAYER
    )
  }

  /**
   * Checks whether or not the given DataProvider contains a value for the given edge.
   * @return {boolean}
   */
  function isValueSet(
    /** yfiles.algorithms.IDataProvider */ dataProvider,
    /** yfiles.algorithms.Edge */ edge
  ) {
    return dataProvider !== null && dataProvider.get(edge) !== null
  }

  /**
   * Removes empty layers and ensures that the smallest layer has value 0.
   * @return {number}
   */
  function normalize(
    /** yfiles.algorithms.Graph */ graph,
    /** yfiles.algorithms.INodeMap */ layer
  ) {
    if (graph.empty) {
      return 0
    }
    const nodes = graph.getNodeArray()
    nodes.sort((node1, node2) => {
      const layer1 = layer.getInt(node1)
      const layer2 = layer.getInt(node2)
      if (layer1 === layer2) {
        return 0
      }
      return layer1 < layer2 ? -1 : 1
    })
    let lastLayer = layer.getInt(nodes[0])
    let realLayer = 0
    for (let i = 0; i < nodes.length; i++) {
      const currentLayer = layer.getInt(nodes[i])
      if (currentLayer !== lastLayer) {
        realLayer++
        lastLayer = currentLayer
      }
      layer.setInt(nodes[i], realLayer)
    }
    return realLayer + 1
  }

  const MIN_PREFERRED_PLACEMENT_DISTANCE = 3.0
  const MAX_PREFERRED_PLACEMENT_DISTANCE = 40.0

  /**
   * A label profit model for the {@link FlowchartLayout}.
   */
  class FlowchartLabelProfitModel extends yfiles.lang.Class(yfiles.layout.IProfitModel) {
    constructor(/** yfiles.layout.LayoutGraph */ graph) {
      super()
      this.graph = graph
      this.label2OriginalBox = yfiles.algorithms.Maps.createHashMap()
      graph.nodes.forEach(node => {
        const nll = graph.getLabelLayout(node)
        for (let i = 0; i < nll.length; i++) {
          const nlm = nll[i].labelModel
          if (nlm instanceof yfiles.layout.DiscreteNodeLabelLayoutModel) {
            this.label2OriginalBox.set(nll[i], nll[i].modelParameter)
          }
        }
      })
    }

    getProfit(/** yfiles.layout.LabelCandidate */ candidate) {
      return yfiles.layout.IEdgeLabelLayout.isInstance(candidate.owner)
        ? calcEdgeLabelProfit(this.graph, candidate)
        : this.calcNodeLabelProfit(candidate)
    }

    /**
     * Returns the profit-value for the given node label candidate.
     * @return {number}
     */
    calcNodeLabelProfit(/** yfiles.layout.LabelCandidate */ candidate) {
      const nl = /** @type {yfiles.layout.INodeLabelLayout} */ candidate.owner
      if (nl.labelModel instanceof yfiles.layout.DiscreteNodeLabelLayoutModel) {
        const pos = Number.parseInt(candidate.parameter)
        const originalPos = Number.parseInt(this.label2OriginalBox.get(nl))
        if (pos === originalPos) {
          return 1.0
        }

        switch (pos) {
          case yfiles.layout.DiscreteNodeLabelPositions.NORTH:
          case yfiles.layout.DiscreteNodeLabelPositions.SOUTH:
          case yfiles.layout.DiscreteNodeLabelPositions.WEST:
          case yfiles.layout.DiscreteNodeLabelPositions.EAST:
            return 0.95
          case yfiles.layout.DiscreteNodeLabelPositions.NORTH_EAST:
          case yfiles.layout.DiscreteNodeLabelPositions.NORTH_WEST:
          case yfiles.layout.DiscreteNodeLabelPositions.SOUTH_EAST:
          case yfiles.layout.DiscreteNodeLabelPositions.SOUTH_WEST:
            return 0.9
          default:
            return 0.0
        }
      } else {
        return 0.0
      }
    }

    /**
     * Returns the length of the given path which is an summation of the lengths of the segments.
     * @return {number}
     */
    static calcPathLength(/** yfiles.algorithms.YPointPath */ path) {
      let length = 0.0
      for (let cur = path.lineSegments(); cur.ok; cur.next()) {
        length += cur.lineSegment.length()
      }
      return length
    }

    /**
     * Returns the distance between a rectangle and a point.
     * @return {number}
     */
    static getDistanceToRect(
      /** yfiles.algorithms.YRectangle */ rect,
      /** yfiles.algorithms.YPoint */ point
    ) {
      if (rect.contains(point)) {
        return 0.0
      }

      // determine corners of the rectangle
      const upperLeft = rect.location
      const lowerLeft = new yfiles.algorithms.YPoint(upperLeft.x, upperLeft.y + rect.height)
      const lowerRight = new yfiles.algorithms.YPoint(lowerLeft.x + rect.width, lowerLeft.y)
      const upperRight = new yfiles.algorithms.YPoint(lowerRight.x, upperLeft.y)
      // determine minDist to one of the four border segments
      let minDist = Number.MAX_VALUE
      const rLeftSeg = new yfiles.algorithms.LineSegment(upperLeft, lowerLeft)
      minDist = Math.min(minDist, FlowchartLabelProfitModel.getDistanceToLine(rLeftSeg, point))
      const rRightSeg = new yfiles.algorithms.LineSegment(upperRight, lowerRight)
      minDist = Math.min(minDist, FlowchartLabelProfitModel.getDistanceToLine(rRightSeg, point))
      const rTopSeg = new yfiles.algorithms.LineSegment(upperLeft, upperRight)
      minDist = Math.min(minDist, FlowchartLabelProfitModel.getDistanceToLine(rTopSeg, point))
      const rBottomSeg = new yfiles.algorithms.LineSegment(lowerLeft, lowerRight)
      minDist = Math.min(minDist, FlowchartLabelProfitModel.getDistanceToLine(rBottomSeg, point))
      return minDist
    }

    /**
     * Returns the distance between a line and a point.
     * @return {number}
     */
    static getDistanceToLine(
      /** yfiles.algorithms.LineSegment */ line,
      /** yfiles.algorithms.YPoint */ point
    ) {
      const x1 = line.firstEndPoint.x
      const y1 = line.firstEndPoint.y
      // adjust vectors relative to first endpoints of line
      const x2 = line.secondEndPoint.x - x1
      const y2 = line.secondEndPoint.y - y1
      let pX = point.x - x1
      let pY = point.y - y1
      // calculate distance
      let /** number */ projSquaredDist
      if (pX * x2 + pY * y2 <= 0.0) {
        projSquaredDist = 0.0
      } else {
        pX = x2 - pX
        pY = y2 - pY
        const tmp = pX * x2 + pY * y2
        projSquaredDist = tmp <= 0.0 ? 0.0 : tmp * tmp / (x2 * x2 + y2 * y2)
      }
      const squaredDist = pX * pX + (pY * pY - projSquaredDist)
      return squaredDist < 0.0 ? 0.0 : Math.sqrt(squaredDist)
    }
  }

  /**
   * Returns the profit-value for the given edge label candidate.
   * @return {number}
   */
  function calcEdgeLabelProfit(
    /** yfiles.layout.LayoutGraph */ graph,
    /** yfiles.layout.LabelCandidate */ candidate
  ) {
    const edge = graph.getOwnerEdge(candidate.owner)
    if (FlowchartElements.isRegularEdge(graph, edge)) {
      const eLength = FlowchartLabelProfitModel.calcPathLength(graph.getPath(edge))
      const maxPreferredPlacementDistance = Math.max(
        MAX_PREFERRED_PLACEMENT_DISTANCE,
        eLength * 0.2
      )
      const minDistToSource = FlowchartLabelProfitModel.getDistanceToRect(
        candidate.boundingBox,
        graph.getSourcePointAbs(edge)
      )
      if (minDistToSource > maxPreferredPlacementDistance) {
        return 0.0
      } else if (minDistToSource < MIN_PREFERRED_PLACEMENT_DISTANCE) {
        return 0.5
      }
      return 1.0 - minDistToSource / maxPreferredPlacementDistance
    }
    return 0.0
  }

  /**
   * A calculator for aligning the longest paths in the flowchart diagram.
   */
  class FlowchartAlignmentCalculator {
    constructor() {
      this.$layoutOrientation = yfiles.layout.LayoutOrientation.TOP_TO_BOTTOM
    }

    /**
     * Gets the layout orientation.
     * @type {number}
     */
    get layoutOrientation() {
      return this.$layoutOrientation
    }

    /**
     * Sets the layout orientation.
     * @type {number}
     */
    set layoutOrientation(/** number */ value) {
      this.$layoutOrientation = value
    }

    determineAlignment(
      /** yfiles.layout.LayoutGraph */ graph /** yfiles.hierarchic.ILayoutDataProvider */,
      ldp,
      /** yfiles.algorithms.INodeMap */ nodeAlignment /** yfiles.algorithms.IEdgeMap */,
      edgeLength
    ) {
      graph.sortEdges(new PositionEdgeComparer(true, ldp), new PositionEdgeComparer(false, ldp))
      const edgeIsAlignable = this.determineAlignableEdges(graph, ldp)
      this.determineEdgeLengths(graph, ldp, edgeIsAlignable, edgeLength)
      const edgePriority = determineEdgePriorities(graph, edgeIsAlignable, edgeLength)
      const nodeAlignmentCalculator = new NodeAlignmentCalculator(this.$layoutOrientation)
      nodeAlignmentCalculator.calculateAlignment(
        graph,
        ldp,
        edgeIsAlignable,
        edgePriority,
        nodeAlignment
      )
      graph.addDataProvider(FlowchartPortOptimizer.NODE_TO_ALIGN_DP_KEY, nodeAlignment)
    }

    /**
     * Checks whether or not the given node is not an annotation or grouping dummy.
     * @return {boolean}
     */
    isSpecialNode(
      /** yfiles.algorithms.Graph */ graph,
      /** yfiles.algorithms.Node */ node,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp
    ) {
      return (
        ldp.getNodeData(node).type === yfiles.hierarchic.NodeDataType.NORMAL &&
        !FlowchartElements.isAnnotation(node.graph, node) &&
        !FlowchartTransformerStage.isGroupingDummy(graph, node)
      )
    }

    /**
     * Checks whether or not the given edge is relevant for the layout direction. Only non-message-flow edges are
     * relevant.
     * @return {boolean}
     */
    isRelevant(
      /** yfiles.algorithms.Graph */ graph,
      /** yfiles.algorithms.Edge */ e,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp
    ) {
      return !FlowchartElements.isMessageFlow(graph, FlowchartPortOptimizer.getOriginalEdge(e, ldp))
    }

    /**
     * Returns true if the given edge can be aligned, that is its port constraints are not flatwise, and its end nodes
     * are not in different swimlanes and do not belong to different groups.
     * @return {boolean}
     */
    isAlignable(
      /** yfiles.algorithms.Graph */ graph /** yfiles.hierarchic.ILayoutDataProvider */,
      ldp,
      /** yfiles.algorithms.Edge */ edge
    ) {
      const edgeData = ldp.getEdgeData(edge)
      if (
        hasFlatwisePortConstraint(edgeData) ||
        hasFlatwiseCandidateCollection(edgeData, this.layoutOrientation)
      ) {
        return false
      }
      const source = edge.source
      const target = edge.target
      const laneId1 = FlowchartPortOptimizer.getSwimlaneId(source, ldp)
      const laneId2 = FlowchartPortOptimizer.getSwimlaneId(target, ldp)
      if (laneId1 !== -1 && laneId1 !== laneId2) {
        return false
      }
      const node2Parent = graph.getDataProvider(yfiles.layout.GroupingKeys.PARENT_NODE_ID_DP_KEY)
      return (
        node2Parent === null ||
        node2Parent.get(source) === null ||
        node2Parent.get(source).equals(node2Parent.get(target))
      )
    }

    /**
     * Collects all edges that are relevant and alignable.
     * @return {yfiles.algorithms.IDataProvider}
     */
    determineAlignableEdges(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.hierarchic.ILayoutDataProvider */
      ldp
    ) {
      const edgeIsAlignable = yfiles.algorithms.Maps.createHashedEdgeMap()
      graph.edges.forEach(edge => {
        edgeIsAlignable.setBoolean(
          edge,
          this.isAlignable(graph, ldp, edge) && this.isRelevant(graph, edge, ldp)
        )
      })
      return edgeIsAlignable
    }

    /**
     * Determines edge lengths such that, in longest paths, edges are preferred that guarantee a suitable port
     * assignment.
     */
    determineEdgeLengths(
      /** yfiles.layout.LayoutGraph */ graph /** yfiles.hierarchic.ILayoutDataProvider */,
      layoutData,
      /** yfiles.algorithms.IDataProvider */ edgeIsAlignable,
      /** yfiles.algorithms.IEdgeMap */ edgeLength
    ) {
      const ZeroLength = 0
      const BasicDummyEdgeLength = 1
      const BasicEdgeLength = 5
      const PenaltyLength = BasicEdgeLength + graph.nodeCount
      const HighPenaltyLength = PenaltyLength * 8
      graph.edges.forEach(e => {
        if (hasFlatwisePortConstraint(layoutData.getEdgeData(e))) {
          edgeLength.setInt(e, ZeroLength)
        } else if (isRealEdge(e, layoutData)) {
          edgeLength.setInt(e, BasicEdgeLength)
        } else {
          edgeLength.setInt(e, BasicDummyEdgeLength)
        }
      })
      graph.nodes.forEach(node => {
        let i
        let edges
        const nodeData = layoutData.getNodeData(node)
        const type = nodeData.type
        if (
          type === yfiles.hierarchic.NodeDataType.SOURCE_GROUP_NODE ||
          type === yfiles.hierarchic.NodeDataType.TARGET_GROUP_NODE
        ) {
          // assign higher length to inner edges
          edges =
            type === yfiles.hierarchic.NodeDataType.SOURCE_GROUP_NODE
              ? new yfiles.algorithms.EdgeList(node.getOutEdgeCursor()).toEdgeArray()
              : new yfiles.algorithms.EdgeList(node.getInEdgeCursor()).toEdgeArray()
          for (i = 1; i < edges.length - 1; i++) {
            edgeLength.setInt(edges[i], edgeLength.getInt(edges[i]) + BasicEdgeLength)
          }
        }
        if (!this.isSpecialNode(graph, node, layoutData) || node.degree < 3) {
          return
        }
        if (node.outDegree === 2 && node.inDegree === 2) {
          const firstIn = node.firstInEdge
          const lastOut = node.lastOutEdge
          const lastIn = node.lastInEdge
          const firstOut = node.firstOutEdge
          const preventFirstIn =
            !edgeIsAlignable.getBoolean(firstIn) || !edgeIsAlignable.getBoolean(lastOut)
          const preventFirstOut =
            !edgeIsAlignable.getBoolean(firstOut) || !edgeIsAlignable.getBoolean(lastIn)
          if (!preventFirstOut || !preventFirstIn) {
            if (preventFirstIn) {
              edgeLength.setInt(firstIn, ZeroLength)
              edgeLength.setInt(lastOut, ZeroLength)
            }
            if (preventFirstOut) {
              edgeLength.setInt(firstOut, ZeroLength)
              edgeLength.setInt(lastIn, ZeroLength)
            }
            if (
              edgeLength.getInt(firstIn) + edgeLength.getInt(lastOut) >
              edgeLength.getInt(lastIn) + edgeLength.getInt(firstOut)
            ) {
              edgeLength.setInt(firstIn, edgeLength.getInt(firstIn) + HighPenaltyLength)
              edgeLength.setInt(lastOut, edgeLength.getInt(lastOut) + HighPenaltyLength)
            } else {
              edgeLength.setInt(lastIn, edgeLength.getInt(lastIn) + HighPenaltyLength)
              edgeLength.setInt(firstOut, edgeLength.getInt(firstOut) + HighPenaltyLength)
            }
            return
          }
        }
        let hasStraightBranch = false
        node.edges.forEach(edge => {
          if (isStraightBranch(graph, edge, layoutData)) {
            hasStraightBranch = true
            edgeLength.setInt(edge, edgeLength.getInt(edge) + PenaltyLength)
          }
        })
        if (!hasStraightBranch) {
          edges =
            node.outDegree >= node.inDegree
              ? new yfiles.algorithms.EdgeList(node.getOutEdgeCursor()).toEdgeArray()
              : new yfiles.algorithms.EdgeList(node.getInEdgeCursor()).toEdgeArray()
          // assign high length to inner edges (the two non-inner edges should be attached to the side ports)
          for (i = 1; i < edges.length - 1; i++) {
            edgeLength.setInt(edges[i], edgeLength.getInt(edges[i]) + PenaltyLength)
          }
        }
      })
    }
  }

  /**
   * Calculator for node alignments.
   */
  class NodeAlignmentCalculator {
    constructor(/** number */ layoutOrientation) {
      this.layoutOrientation = layoutOrientation
    }

    /**
     * Checks whether or not the current layout orientation is horizontal (i.e. left-to-right)
     * @return {boolean}
     */
    isHorizontalOrientation() {
      return this.layoutOrientation === yfiles.layout.LayoutOrientation.LEFT_TO_RIGHT
    }

    calculateAlignment(
      /** yfiles.layout.LayoutGraph */ graph /** yfiles.hierarchic.ILayoutDataProvider */,
      ldp,
      /** yfiles.algorithms.IDataProvider */ edgeAlignable /** yfiles.algorithms.IDataProvider */,
      edgePriority,
      /** yfiles.algorithms.IDataAcceptor */ nodeAlignment
    ) {
      const grid = yfiles.layout.PartitionGrid.getPartitionGrid(graph)
      if (grid === null) {
        this.calculateAlignmentImpl(graph, ldp, edgeAlignable, edgePriority, nodeAlignment)
      } else {
        const columnPartitionManager = new yfiles.algorithms.GraphPartitionManager(
          graph,
          new SwimlaneIdProvider(ldp)
        )
        try {
          columnPartitionManager.hideAll()
          for (let i = 0; i < grid.columns.size; i++) {
            columnPartitionManager.displayPartition(i)
            if (graph.nodeCount > 1) {
              this.calculateAlignmentImpl(graph, ldp, edgeAlignable, edgePriority, nodeAlignment)
            }
          }
        } finally {
          columnPartitionManager.unhideAll()
        }
      }
    }

    calculateAlignmentImpl(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.hierarchic.ILayoutDataProvider */
      ldp,
      /** yfiles.algorithms.IDataProvider */ edgeAlignable,
      /** yfiles.algorithms.IDataProvider */
      edgePriority,
      /** yfiles.algorithms.IDataAcceptor */ node2AlignWith
    ) {
      let nc
      let edge
      let nRep
      let n
      let i
      let connector
      let tRep
      let sRep
      let ec
      const node2LaneAlignment = this.createLaneAlignmentMap(graph, ldp)
      const edgeMinLength = yfiles.algorithms.Maps.createHashedEdgeMap()
      const edgeWeight = yfiles.algorithms.Maps.createHashedEdgeMap()
      const node2NetworkRep = yfiles.algorithms.Maps.createHashedNodeMap()
      const groupNode2BeginRep = yfiles.algorithms.Maps.createHashMap()
      const groupNode2EndRep = yfiles.algorithms.Maps.createHashMap()
      const network = new yfiles.algorithms.Graph()
      // create network nodes
      graph.nodes.forEach(node => {
        const data = ldp.getNodeData(node)
        if (data !== null && data.type === yfiles.hierarchic.NodeDataType.GROUP_BEGIN) {
          // all group begin dummies of the same group node are mapped to the same network node
          nRep = /** @type {yfiles.algorithms.Node} */ groupNode2BeginRep.get(data.groupNode)
          if (nRep === null) {
            nRep = network.createNode()
            groupNode2BeginRep.set(data.groupNode, nRep)
          }
        } else if (data !== null && data.type === yfiles.hierarchic.NodeDataType.GROUP_END) {
          // all group end dummies of the same group node are mapped to the same network node
          nRep = /** @type {yfiles.algorithms.Node} */ groupNode2EndRep.get(data.groupNode)
          if (nRep === null) {
            nRep = network.createNode()
            groupNode2EndRep.set(data.groupNode, nRep)
          }
        } else {
          nRep = network.createNode()
        }
        node2NetworkRep.set(node, nRep)
      })
      // consider edges
      const nonAlignableEdges = new yfiles.algorithms.EdgeList()
      graph.edges.forEach(e => {
        if (e.selfLoop || (isGroupNodeBorder(e.source, ldp) && isGroupNodeBorder(e.target, ldp))) {
          return
        }
        if (!edgeAlignable.getBoolean(e)) {
          nonAlignableEdges.addLast(e)
          return
        }
        const absNode = network.createNode()
        const priority = edgePriority.getInt(e)
        sRep = /** @type {yfiles.algorithms.Node} */ node2NetworkRep.get(e.source)
        tRep = /** @type {yfiles.algorithms.Node} */ node2NetworkRep.get(e.target)
        const sConnector = network.createEdge(sRep, absNode)
        edgeMinLength.setInt(sConnector, 0)
        edgeWeight.setInt(sConnector, priority)
        const tConnector = network.createEdge(tRep, absNode)
        edgeMinLength.setInt(tConnector, 0)
        edgeWeight.setInt(tConnector, priority)
      })

      // also consider same layer edges
      for (ec = FlowchartPortOptimizer.getAllSameLayerEdges(graph, ldp).edges(); ec.ok; ec.next()) {
        const e = ec.edge
        if (
          !e.selfLoop &&
          (!isGroupNodeBorder(e.source, ldp) || !isGroupNodeBorder(e.target, ldp))
        ) {
          sRep = node2NetworkRep.get(e.source)
          tRep = node2NetworkRep.get(e.target)
          connector =
            ldp.getNodeData(e.source).position < ldp.getNodeData(e.target).position
              ? network.createEdge(sRep, tRep)
              : network.createEdge(tRep, sRep)
          edgeMinLength.setInt(connector, 1)
          edgeWeight.setInt(connector, FlowchartPortOptimizer.PRIORITY_BASIC)
        }
      }
      const nodes = graph.getNodeArray()
      nodes.sort((node1, node2) => {
        const nd1 = ldp.getNodeData(node1)
        const nd2 = ldp.getNodeData(node2)
        const l1 = nd1.layer
        const l2 = nd2.layer
        if (l1 < l2) {
          return -1
        } else if (l1 > l2) {
          return 1
        }
        const position1 = nd1.position
        const position2 = nd2.position
        if (position1 === position2) {
          return 0
        }
        return position1 < position2 ? -1 : 1
      })

      let /** yfiles.algorithms.Node */ last = null
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i]
        if (last !== null && areInSameLayer(last, n, ldp)) {
          nRep = /** @type {yfiles.algorithms.Node} */ node2NetworkRep.get(n)
          const lastRep = /** @type {yfiles.algorithms.Node} */ node2NetworkRep.get(last)
          if (!network.containsEdge(lastRep, nRep)) {
            connector = network.createEdge(lastRep, nRep)
            // guarantees that last is placed to the left of n
            const minLength = calcMinLength(last, n, graph, ldp)
            edgeMinLength.setInt(connector, minLength)
            edgeWeight.setInt(connector, 0)
          }
        }
        last = n
      }
      // For each non-alignable edge, we create a connector with min length 1,
      // but only it has no other alignable in-edge.
      const nonAlignableConnectorMap = yfiles.algorithms.Maps.createHashedEdgeMap()
      nonAlignableEdges.forEach(e => {
        const hasAlignableInEdge = checkPredicate(e.target.getInEdgeCursor(), edgeAlignable)
        if (hasAlignableInEdge) {
          return
        }
        sRep = /** @type {yfiles.algorithms.Node} */ node2NetworkRep.get(e.source)
        tRep = /** @type {yfiles.algorithms.Node} */ node2NetworkRep.get(e.target)
        const edgeData = ldp.getEdgeData(e)
        if (hasLeftConstraint(edgeData, true) || hasRightConstraint(edgeData, false)) {
          connector = network.createEdge(tRep, sRep)
        } else if (hasRightConstraint(edgeData, true) || hasLeftConstraint(edgeData, false)) {
          connector = network.createEdge(sRep, tRep)
        } else {
          return
        }
        nonAlignableConnectorMap.setBoolean(connector, true)
        edgeMinLength.setInt(connector, 1)
        edgeWeight.setInt(connector, FlowchartPortOptimizer.PRIORITY_BASIC)
      })
      // Afterwards, we ensure that the network is still acyclic.
      for (
        let cycle = yfiles.algorithms.Cycles.findCycle(network, true);
        !cycle.isEmpty();
        cycle = yfiles.algorithms.Cycles.findCycle(network, true)
      ) {
        let removed = false
        for (ec = cycle.edges(); ec.ok && !removed; ec.next()) {
          edge = ec.edge
          if (nonAlignableConnectorMap.getBoolean(edge)) {
            network.removeEdge(edge)
            removed = true
          }
        }
        if (!removed) {
          network.removeEdge(cycle.firstEdge())
        }
      }
      // connect nodes to global source/sink
      const globalSource = network.createNode()
      const globalSink = network.createNode()
      for (nc = graph.getNodeCursor(); nc.ok; nc.next()) {
        n = nc.node
        nRep = /** @type {yfiles.algorithms.Node} */ node2NetworkRep.get(n)
        const nLaneAlignment = node2LaneAlignment.getInt(n)
        if (!network.containsEdge(nRep, globalSink)) {
          const globalSinkConnector = network.createEdge(nRep, globalSink)
          edgeWeight.setInt(
            globalSinkConnector,
            nLaneAlignment === FlowchartPortOptimizer.LANE_ALIGNMENT_RIGHT
              ? FlowchartPortOptimizer.PRIORITY_LOW
              : 0
          )
          edgeMinLength.setInt(globalSinkConnector, 0)
        }
        if (!network.containsEdge(globalSource, nRep)) {
          const globalSourceConnector = network.createEdge(globalSource, nRep)
          edgeWeight.setInt(
            globalSourceConnector,
            nLaneAlignment === FlowchartPortOptimizer.LANE_ALIGNMENT_LEFT
              ? FlowchartPortOptimizer.PRIORITY_LOW
              : 0
          )
          edgeMinLength.setInt(globalSourceConnector, 0)
        }
      }
      // apply simplex to each connected component of the network
      const networkNode2AlignmentLayer = yfiles.algorithms.Maps.createHashedNodeMap()
      yfiles.algorithms.RankAssignments.simplex(
        network,
        networkNode2AlignmentLayer,
        edgeWeight,
        edgeMinLength
      )
      // transfer results to original nodes
      const node2AlignmentLayer = yfiles.algorithms.Maps.createHashedNodeMap()

      for (nc = graph.getNodeCursor(); nc.ok; nc.next()) {
        n = nc.node
        nRep = /** @type {yfiles.algorithms.Node} */ node2NetworkRep.get(n)
        node2AlignmentLayer.setNumber(n, networkNode2AlignmentLayer.getInt(nRep))
      }
      // we do not want to align bend nodes with common nodes except if the (chain of) dummy nodes can be aligned with
      // the corresponding common node
      const seenBendMap = yfiles.algorithms.Maps.createHashedNodeMap()
      for (nc = graph.getNodeCursor(); nc.ok; nc.next()) {
        n = nc.node
        if (isBendNode(n, ldp) && !seenBendMap.getBoolean(n)) {
          adjustAlignmentLayer(n, node2AlignmentLayer, seenBendMap, ldp)
        }
      }
      // add alignment constraints
      nodes.sort((node1, node2) => {
        const al1 = node2AlignmentLayer.getNumber(node1)
        const al2 = node2AlignmentLayer.getNumber(node2)
        if (al1 < al2) {
          return -1
        } else if (al1 > al2) {
          return 1
        }
        const layer1 = ldp.getNodeData(node1).layer
        const layer2 = ldp.getNodeData(node2).layer
        if (layer1 === layer2) {
          return 0
        }
        return layer1 < layer2 ? -1 : 1
      })
      last = null
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i]
        if (!isGroupNodeBorder(n, ldp) && !isGroupNodeProxy(n, ldp)) {
          if (
            last !== null &&
            node2AlignmentLayer.getNumber(last) === node2AlignmentLayer.getNumber(n)
          ) {
            node2AlignWith.set(n, last)
            // node n should be aligned with last
          }
          last = n
        }
      }
    }

    /**
     * Creates a node map containing the alignment in swimlanes.
     * @return {yfiles.algorithms.INodeMap}
     */
    createLaneAlignmentMap(
      /** yfiles.layout.LayoutGraph */ graph,
      /** yfiles.hierarchic.ILayoutDataProvider */
      ldp
    ) {
      const node2LaneAlignment = yfiles.algorithms.Maps.createHashedNodeMap()
      graph.nodes.forEach(node => {
        node2LaneAlignment.setInt(node, this.getLaneAlignment(node, ldp))
      })
      return node2LaneAlignment
    }

    /**
     * Returns the alignment of the given node inside a swimlane.
     * @return {number}
     */
    getLaneAlignment(
      /** yfiles.algorithms.Node */ node,
      /** yfiles.hierarchic.ILayoutDataProvider */ ldp
    ) {
      let toLeftCount = 0
      let toRightCount = 0
      const nEdges = new yfiles.algorithms.EdgeList(node.getEdgeCursor())
      nEdges.splice(FlowchartPortOptimizer.getSameLayerEdges(node, true, ldp))
      nEdges.splice(FlowchartPortOptimizer.getSameLayerEdges(node, false, ldp))
      nEdges.forEach(edge => {
        if (FlowchartPortOptimizer.isToLeftPartition(node, edge.opposite(node), ldp)) {
          toLeftCount++
        } else if (FlowchartPortOptimizer.isToRightPartition(node, edge.opposite(node), ldp)) {
          toRightCount++
        }
      })
      if (toLeftCount > toRightCount) {
        return FlowchartPortOptimizer.LANE_ALIGNMENT_LEFT
      } else if (toLeftCount < toRightCount) {
        return FlowchartPortOptimizer.LANE_ALIGNMENT_RIGHT
      } else if (this.isHorizontalOrientation()) {
        return FlowchartPortOptimizer.LANE_ALIGNMENT_RIGHT
      }
      return FlowchartPortOptimizer.LANE_ALIGNMENT_LEFT
    }
  }

  class SwimlaneIdProvider extends yfiles.algorithms.DataProviderAdapter {
    constructor(/** yfiles.hierarchic.ILayoutDataProvider */ ldp) {
      super()
      this.ldp = ldp
    }

    get(dataHolder) {
      const swimlaneID = FlowchartPortOptimizer.getSwimlaneId(dataHolder, this.ldp)
      return swimlaneID < 0 ? dataHolder : swimlaneID
    }
  }

  /**
   * Checks whether or not the given edge data contains a west constraint.
   * @return {boolean}
   */
  function hasLeftConstraint(/** yfiles.hierarchic.IEdgeData */ edgeData, /** boolean */ source) {
    const pc = source ? edgeData.sourcePortConstraint : edgeData.targetPortConstraint
    return pc && pc.atWest
  }

  /**
   * Checks whether or not the given edge data contains a east constraint.
   * @return {boolean}
   */
  function hasRightConstraint(/** yfiles.hierarchic.IEdgeData */ edgeData, /** boolean */ source) {
    const pc = source ? edgeData.sourcePortConstraint : edgeData.targetPortConstraint
    return pc && pc.atEast
  }

  /**
   * Calculates the minimum length between the two nodes.
   * @return {number}
   */
  function calcMinLength(
    /** yfiles.algorithms.Node */ node1,
    /** yfiles.algorithms.Node */ node2,
    /** yfiles.layout.LayoutGraph */
    graph,
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp
  ) {
    let n1GroupNode
    let n2GroupNode
    const node2Parent = graph.getDataProvider(yfiles.layout.GroupingKeys.PARENT_NODE_ID_DP_KEY)
    if (isGroupNodeBorder(node1, ldp) && isGroupNodeBorder(node2, ldp)) {
      n1GroupNode = ldp.getNodeData(node1).groupNode
      n2GroupNode = ldp.getNodeData(node2).groupNode
      if (
        n1GroupNode !== n2GroupNode &&
        node2Parent.get(node1) !== n2GroupNode &&
        node2Parent.get(node2) !== n1GroupNode
      ) {
        return 1
      }
      return 0
    } else if (isGroupNodeBorder(node1, ldp)) {
      n1GroupNode = ldp.getNodeData(node1).groupNode
      n2GroupNode = isGroupNodeProxy(node2, ldp)
        ? ldp.getNodeData(node2).groupNode
        : /** @type {yfiles.algorithms.Node} */ node2Parent.get(node2)
      if (n2GroupNode === n1GroupNode) {
        return 0
      }
      return 1
    } else if (isGroupNodeBorder(node2, ldp)) {
      n1GroupNode = isGroupNodeProxy(node1, ldp)
        ? ldp.getNodeData(node1).groupNode
        : /** @type {yfiles.algorithms.Node} */ node2Parent.get(node1)
      n2GroupNode = ldp.getNodeData(node2).groupNode
      if (n1GroupNode === n2GroupNode) {
        return 0
      }
      return 1
    }
    return 1
  }

  /**
   * Adjusts dummy layers that contain dummies for alignment.
   */
  function adjustAlignmentLayer(
    /** yfiles.algorithms.Node */ dummy /** yfiles.algorithms.INodeMap */,
    node2AlignmentLayer,
    /** yfiles.algorithms.IDataAcceptor */ seenBendMap,
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp
  ) {
    const dummyAlignmentLayer = node2AlignmentLayer.getNumber(dummy)
    const seenDummyNodes = new yfiles.algorithms.NodeList(dummy)
    let alignsWithCommonNode = false
    let inEdge = dummy.firstInEdge
    while (
      inEdge !== null &&
      isBendNode(inEdge.source, ldp) &&
      dummyAlignmentLayer === node2AlignmentLayer.getNumber(inEdge.source)
    ) {
      seenDummyNodes.addLast(inEdge.source)
      inEdge = inEdge.source.firstInEdge
    }
    if (inEdge !== null && !isBendNode(inEdge.source, ldp)) {
      alignsWithCommonNode = dummyAlignmentLayer === node2AlignmentLayer.getNumber(inEdge.source)
    }
    let outEdge = dummy.firstOutEdge
    while (
      outEdge !== null &&
      isBendNode(outEdge.target, ldp) &&
      dummyAlignmentLayer === node2AlignmentLayer.getNumber(outEdge.target)
    ) {
      seenDummyNodes.addLast(outEdge.target)
      outEdge = outEdge.target.firstOutEdge
    }
    if (!alignsWithCommonNode && outEdge !== null && !isBendNode(outEdge.target, ldp)) {
      alignsWithCommonNode = dummyAlignmentLayer === node2AlignmentLayer.getNumber(outEdge.target)
    }
    for (let nc = seenDummyNodes.nodes(); nc.ok; nc.next()) {
      seenBendMap.setBoolean(nc.node, true)
      if (!alignsWithCommonNode) {
        node2AlignmentLayer.setNumber(nc.node, dummyAlignmentLayer - 0.5)
        // assign dummy nodes to a separate layer
      }
    }
  }

  /**
   * Checks whether or not the predicate evaluates to 'true' for at least one of the elements in the cursor.
   * @return {boolean}
   */
  function checkPredicate(
    /** yfiles.algorithms.ICursor */ cursor,
    /** yfiles.algorithms.IDataProvider */ predicate
  ) {
    for (cursor.toFirst(); cursor.ok; cursor.next()) {
      if (predicate.getBoolean(cursor.current)) {
        return true
      }
    }
    return false
  }

  /**
   * Checks whether or not the given nodes belong to the same layer.
   * @return {boolean}
   */
  function areInSameLayer(
    /** yfiles.algorithms.Node */ node1,
    /** yfiles.algorithms.Node */ node2,
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp
  ) {
    return ldp.getNodeData(node1).layer === ldp.getNodeData(node2).layer
  }

  /**
   * Checks whether or not the given node represents a bend.
   * @return {boolean}
   */
  function isBendNode(
    /** yfiles.algorithms.Node */ node,
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp
  ) {
    const data = ldp.getNodeData(node)
    return data !== null && data.type === yfiles.hierarchic.NodeDataType.BEND
  }

  /**
   * Checks whether or not the given node represents the border of a group node.
   * @return {boolean}
   */
  function isGroupNodeBorder(
    /** yfiles.algorithms.Node */ node /** yfiles.hierarchic.ILayoutDataProvider */,
    ldp
  ) {
    const data = ldp.getNodeData(node)
    return (
      data !== null &&
      (data.type === yfiles.hierarchic.NodeDataType.GROUP_BEGIN ||
        data.type === yfiles.hierarchic.NodeDataType.GROUP_END)
    )
  }

  /**
   * Checks whether or not the given node is a proxy for edges at group nodes.
   * @return {boolean}
   */
  function isGroupNodeProxy(
    /** yfiles.algorithms.Node */ node /** yfiles.hierarchic.ILayoutDataProvider */,
    ldp
  ) {
    const data = ldp.getNodeData(node)
    return data !== null && data.type === yfiles.hierarchic.NodeDataType.PROXY_FOR_EDGE_AT_GROUP
  }

  /**
   * Checks whether or not the given edge is between normal nodes.
   * @return {boolean}
   */
  function isRealEdge(
    /** yfiles.algorithms.Edge */ edge /** yfiles.hierarchic.ILayoutDataProvider */,
    layoutData
  ) {
    return (
      layoutData.getNodeData(edge.source).type === yfiles.hierarchic.NodeDataType.NORMAL &&
      layoutData.getNodeData(edge.target).type === yfiles.hierarchic.NodeDataType.NORMAL
    )
  }

  /**
   * Checks whether or not the given edge's direction is straight.
   * @return {boolean}
   */
  function isStraightBranch(
    /** yfiles.layout.LayoutGraph */ graph,
    /** yfiles.algorithms.Edge */ edge,
    /** yfiles.hierarchic.ILayoutDataProvider */ ldp
  ) {
    return FlowchartLayout.isStraightBranch(
      graph,
      FlowchartPortOptimizer.getOriginalEdge(edge, ldp)
    )
  }

  /**
   * Determines the priorities of the edges. Edges in longer paths get a higher priority.
   * @return {boolean}
   */
  function determineEdgePriorities(
    /** yfiles.layout.LayoutGraph */ graph /** yfiles.algorithms.IDataProvider */,
    edgeIsAlignable,
    /** yfiles.algorithms.IDataProvider */ edgeLength
  ) {
    const edgePriority = yfiles.algorithms.Maps.createHashedEdgeMap()
    const hider = new yfiles.algorithms.LayoutGraphHider(graph)
    try {
      // hide irrelevant edges
      graph.edges.forEach(edge => {
        edgePriority.setInt(edge, FlowchartPortOptimizer.PRIORITY_BASIC)
        if (!edgeIsAlignable.getBoolean(edge)) {
          hider.hide(edge)
        }
      })
      // for each connected component we iteratively find a longest path that is used as critical path
      const node2CompId = yfiles.algorithms.Maps.createHashedNodeMap()
      const compCount = yfiles.algorithms.GraphConnectivity.connectedComponents(graph, node2CompId)
      const gpm = new yfiles.algorithms.GraphPartitionManager(graph, node2CompId)
      try {
        gpm.hideAll()
        for (let i = 0; i < compCount; i++) {
          gpm.displayPartition(i)
          const localHider = new yfiles.algorithms.LayoutGraphHider(graph)
          try {
            let path = yfiles.algorithms.Paths.findLongestPath(graph, edgeLength)
            while (!path.isEmpty()) {
              for (let ec = path.edges(); ec.ok; ec.next()) {
                edgePriority.setInt(ec.edge, FlowchartPortOptimizer.PRIORITY_HIGH)
              }
              localHider.hide(yfiles.algorithms.Paths.constructNodePath(path))
              path = yfiles.algorithms.Paths.findLongestPath(graph, edgeLength)
            }
          } finally {
            localHider.unhideAll()
          }
        }
      } finally {
        gpm.unhideAll()
      }
    } finally {
      hider.unhideAll()
    }
    return edgePriority
  }

  /**
   * Checks whether or not the given edge data contains a flatwise port constraint at source and/or target.
   * @return {boolean}
   */
  function hasFlatwisePortConstraint(/** yfiles.hierarchic.IEdgeData */ edgeData) {
    return (
      FlowchartPortOptimizer.isFlatwisePortConstraint(edgeData.sourcePortConstraint) ||
      FlowchartPortOptimizer.isFlatwisePortConstraint(edgeData.targetPortConstraint)
    )
  }

  /**
   * Checks whether or not the given edge data contains flatwise port candidates at source and/or target.
   * @return {boolean}
   */
  function hasFlatwiseCandidateCollection(
    /** yfiles.hierarchic.IEdgeData */ edgeData /** number */,
    layoutOrientation
  ) {
    return (
      FlowchartPortOptimizer.isFlatwiseCandidateCollection(
        edgeData.sourcePortCandidates,
        layoutOrientation
      ) ||
      FlowchartPortOptimizer.isFlatwiseCandidateCollection(
        edgeData.targetPortCandidates,
        layoutOrientation
      )
    )
  }

  return FlowchartLayout
})