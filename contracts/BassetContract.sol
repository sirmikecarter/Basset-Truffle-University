pragma solidity >=0.4.21 <0.6.0;

contract BassetContract {
    event StorageSet(string _message);

    string public storedHash;
    string public storedName;

    function setItem(string memory _storedHash,string memory _storedName) public {
        storedHash = _storedHash;
        storedName = _storedName;

        emit StorageSet("Data stored successfully!");
    }
}
