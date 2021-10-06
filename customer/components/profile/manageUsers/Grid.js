import React from "react";
import { Spinner } from "react-bootstrap";
import Conditional from "../../Shared/Conditional";
import { Button } from "../../UI";

function Grid({ users, deleteUser, updateUser, gridLoader }) {
  

  const NoUsers = () => {
    return <div className="text-center my-2">
      <p>No users to show</p>
    </div>
  }

  const Loader = () => {
    return <div className="text-center">
      <Spinner />
    </div>
  }

  return (
    <div className="table-responsive">
      <Conditional condition={!gridLoader} elseComponent={<Loader />} >
      <Conditional
        condition={users.length}
        elseComponent={<NoUsers />}
      >
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <>
              {users.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item?.UserName}</td>
                    <td>{item?.Email}</td>
                    <td>
                      <div className="d-flex">
                        {/* <i className="fa fa-pencil px-2 pointer" /> */}
                        <Button
                          className="px-2 py-0 mx-1"
                          variant="primary"
                          onClick={() => updateUser(item?.CustomerAdmin, item?.ID)}
                        >
                          <i className="fa fa-user mr-2" />
                          {item?.CustomerAdmin ? "Dismiss as" : "Make"} Admin
                        </Button>
                        <Button
                          className="px-2 py-0 mx-1"
                          variant="primary"
                          onClick={() => deleteUser(item?.ID)}
                        >
                          <i className="fa fa-trash mr-2" />
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </>
          </tbody>
        </table>
      </Conditional>
      </Conditional>
     
    </div>
  );
}

export default Grid;
