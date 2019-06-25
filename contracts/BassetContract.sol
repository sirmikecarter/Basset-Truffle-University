pragma solidity ^0.5.1;

contract BassetContract {
    string public storedHash;
    string public storedCategory;

    struct Item
    {
        string itemName;
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

    function setItem(string memory _storedHash,string memory _storedCategory, string memory _storedName, uint _storedPrice)
        onlyIfNoItemExists(_storedHash)
        public
    {
        storedHash = _storedHash;
        storedCategory = _storedCategory;
        userStructs[msg.sender].itemList.push(_storedHash);
        userStructs[msg.sender].itemExists[_storedHash] = true;
        userStructs[msg.sender].itemStructs[_storedHash].itemCategory = _storedCategory;
        userStructs[msg.sender].itemStructs[_storedHash].itemName = _storedName;
        userStructs[msg.sender].itemStructs[_storedHash].itemPrice = _storedPrice;

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

    function setUseritemName(string memory _storedHash, string memory _storedName)
        onlyIfItemExists(_storedHash)
        public
        returns(bool success)
    {
        userStructs[msg.sender].itemStructs[_storedHash].itemName = _storedName;
        return true;
    }

    function setUseritemPrice(string memory _storedHash, uint _storedPrice)
        onlyIfItemExists(_storedHash)
        public
        returns(bool success)
    {
        userStructs[msg.sender].itemStructs[_storedHash].itemPrice = _storedPrice;
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

    function getUserItemCategory(string memory _storedHash)
        onlyIfItemExists(_storedHash)
        public
        view
        returns(string memory itemCategory)
    {
        return(
            userStructs[msg.sender].itemStructs[_storedHash].itemCategory );
    }

    function getUserItemName(string memory _storedHash)
        onlyIfItemExists(_storedHash)
        public
        view
        returns(string memory itemName)
    {
        return(
            userStructs[msg.sender].itemStructs[_storedHash].itemName );
    }

    function getUserItemPrice(string memory _storedHash)
        onlyIfItemExists(_storedHash)
        public
        view
        returns(uint itemPrice)
    {
        return(
            userStructs[msg.sender].itemStructs[_storedHash].itemPrice );
    }
}
