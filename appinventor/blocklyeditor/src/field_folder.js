
goog.provide('Blockly.AIFolder');


// Used to rename a folder and its miniworkspace
Blockly.AIFolder.renameFolder = function (newName) {
  // this is bound to field_textinput object
  var oldName = this.text_;
  
  // [lyn, 10/27/13] now check legality of identifiers
  newName = Blockly.LexicalVariable.makeLegalIdentifier(newName);

  // [lyn, 10/28/13] Prevent two folders from having the same name.
  var procBlocks = Blockly.AIFolder.getAllFolderBlocksExcept(this.sourceBlock_);
  var procNames = procBlocks.map(function (decl) { return decl.getFieldValue('NAME'); });
  newName = Blockly.FieldLexicalVariable.nameNotIn(newName, procNames);
  // Sets the name in the miniworkspace if it is open
  if(this.sourceBlock_.expandedFolder_){
    this.sourceBlock_.miniworkspace.svgTitle_.innerHTML=newName;
  }
  return newName;
};

Blockly.AIFolder.getAllFolderBlocksExcept = function (block) {
  var topBlocks = Blockly.mainWorkspace.getTopBlocks();
  var blockArray = [];
  for (var i=0;i<topBlocks.length;i++){
    if(topBlocks[i].type === "folder") {
      if (topBlocks[i] !== block) {
        blockArray.push(topBlocks[i]);
      }
    }
  }
  return blockArray;
};