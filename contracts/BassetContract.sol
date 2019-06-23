pragma solidity ^0.5.1;

contract BassetContract {
    string public storedHash;
    string public storedCategory;

    struct Item
    {
        string itemCategory;
        uint itemPrice;
    }

    struct User
    {
        string[] itemList;
        uint itemCount;
        mapping(string => Item) itemStructs;
        mapping(string => bool) itemExists;
    }

    modifier onlyIfItemExists (string memory _storedHash) {
        if(userStructs[msg.sender].itemExists[_storedHash] != true) revert();
        _;

    }

    modifier onlyIfNoItemExists (string memory _storedHash) {
        if(userStructs[msg.sender].itemExists[_storedHash] != false) revert();
        _;
    }

    event StorageSet(string _message);

    mapping(address => User) userStructs;

    function setItem(string memory _storedHash,string memory _storedCategory)
        onlyIfNoItemExists(_storedHash)
        public
    {
        storedHash = _storedHash;
        storedCategory = _storedCategory;
        userStructs[msg.sender].itemList.push(_storedHash);
        userStructs[msg.sender].itemExists[_storedHash] = true;
        userStructs[msg.sender].itemStructs[_storedHash].itemCategory = _storedCategory;

        emit StorageSet("Item Set Successfully!");
    }

    function setUseritemCategory(string memory _storedHash, string memory _storedCategory)
        onlyIfItemExists(_storedHash)
        public
        returns(bool success)
    {
        userStructs[msg.sender].itemStructs[_storedHash].itemCategory = _storedCategory;
        return true;
    }

    function getUserItemHash(uint index)
        public
        view
        returns(string memory)
    {
        return(
            userStructs[msg.sender].itemList[index]);
    }

    function getUserItemCount()
        public
        view
        returns(uint)
    {
        return(
            userStructs[msg.sender].itemList.length);
    }

    function getUserItemAttributes(string memory _storedHash)
        onlyIfItemExists(_storedHash)
        public
        view
        returns(string memory itemCategory)
    {
        return(
            userStructs[msg.sender].itemStructs[_storedHash].itemCategory );
    }
}
