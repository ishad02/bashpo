import { useEffect, useState } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import { useGetMyFilterOrdersQuery, useCreateOrderMutation, useCancelOrderMutation } from '../slices/ordersApiSlice.js';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import { LinkContainer } from 'react-router-bootstrap';
import { Button } from 'react-bootstrap';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyFilterOrderScreen = () => {
  const { filter: fil } = useParams();
  const { userId: userId } = useParams();
  const { data: orders, refetch, isLoading, error } = useGetMyFilterOrdersQuery({ userId: userId, filter: fil });

  useEffect(() => {
    refetch();
  }, [fil]);

  const navigate = useNavigate();
  const handleChange = (event) => {
    if (event.target.value === 'default') {
      navigate(`/myorder/${userId}`);
    } else {
      navigate(`/myorder/${userId}/filter/${event.target.value}`);
    }
  };
    const [createOrder, { ReorderIsLoading, ReorderError }] = useCreateOrderMutation();
    const placeOrderHandler = async (orderId) => {
    try {
      const res = await createOrder({
        orderItems: orderId.orderItems,
        shippingAddress: orderId.shippingAddress,
        paymentMethod: orderId.paymentMethod,
        itemsPrice: orderId.itemsPrice,
        shippingPrice: orderId.shippingPrice,
        taxPrice: orderId.taxPrice,
        totalPrice: orderId.totalPrice,
      }).unwrap();
      toast.success('Reorder Successful!!');
      navigate(`/order/${res._id}`);
      refetch();
    } catch (err) {
      toast.error(err);
    }
  };

  const [cancelOrder, { cancelOrderIsLoading, cancelOrderError }] = useCancelOrderMutation();
    const cancelOrderHandler = async (orderId) => {
    try {
      const res = await cancelOrder({orderId :orderId})
      console.log(res);
      if(res.error){
          toast.error(res.error.data.message);
      }else{
        toast.success('Order Cancelled Successfully!!');
        refetch();
      }
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <Grid container spacing={2}>
        <Grid item style={{ margin : '10px'}}>
                <Typography variant="h4">Filtered Orders</Typography>
        </Grid>
        {/* <Grid container alignItems="center" justifyContent="space-between"> */}
          <Grid item>
            <Row style={{ alignItems: 'center' }}>
              <Col>
                <FormControl style={{ minWidth: '150px', margin: '10px' }}>
                  <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Filter"
                    onChange={handleChange}
                    variant="outlined"
                    style={{ width: '100%' }}
                  >
                    <MenuItem value={'default'}>Default</MenuItem>
                    <MenuItem value={'paid'}>Paid</MenuItem>
                    <MenuItem value={'notPaid'}>Not Paid</MenuItem>
                    <MenuItem value={'delivered'}>Delivered</MenuItem>
                    <MenuItem value={'notDelivered'}>Not Delivered</MenuItem>
                    <MenuItem value={'cancelled'}>Cancelled</MenuItem>
                    <MenuItem value={'notCancelled'}>Not Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Col>
            </Row>
          </Grid>
        {/* </Grid> */}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant={'error'}>{'Error while finding'}</Message>
        ) : orders && orders.length === 0 ? (
            <Grid item style={{ margin : '10px'}}>
                <Message>No orders found.</Message>
            </Grid>
        ) : (
        <Grid item xs={12}>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Total Price</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Delivery Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders &&
                  orders.map((order) => (
                    <TableRow key={order._id}>
                      <LinkContainer to={`/order/${order._id}`} style={{ cursor: 'pointer', color: 'blue' }}>
                        <TableCell>
                          <b>{order._id}</b>
                        </TableCell>
                      </LinkContainer>
                      <TableCell>{order.user.name}</TableCell>
                      <TableCell>${order.totalPrice}</TableCell>
                      {order.isPaid ? (
                        <TableCell>
                          <b style={{ color: 'green' }}>Paid at : </b>
                          {new Date(order.paidAt).toLocaleString()}
                        </TableCell>
                      ) : (
                        <TableCell style={{ color: 'red' }}>
                          <b>Not Paid</b>
                        </TableCell>
                      )}

                      {order.isPaid && !order.isDelivered ? (
                        <TableCell>
                          <b style={{ color: 'red' }}>Not Delivered</b>
                        </TableCell>
                      ) : !order.isPaid ? (
                        <TableCell style={{ color: 'red' }}>
                          <b>Not Delivered</b>
                        </TableCell>
                      ) : (
                        order.isPaid &&
                        order.isDelivered && <TableCell style={{ color: 'green' }}><b>Delivered</b></TableCell>
                      )}

                     {!order.isPaid ? (
                    <TableCell>
                      {!order.isCancelled ? (
                        <Button variant="danger" onClick={() => cancelOrderHandler(order._id)}>
                          Cancel Order
                        </Button>
                      ) : (
                        <Message variant="error">
                          Order Cancelled
                        </Message>
                      )}
                    </TableCell>
                  ) : order.isDelivered ? (
                    <TableCell>
                      <Button variant="success" onClick={() => placeOrderHandler(order)}>
                        Reorder
                      </Button>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Button variant="danger" disabled>
                        Cancel Order
                      </Button>
                    </TableCell>
                  )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        )}
      </Grid>
  );
};

export default MyFilterOrderScreen;
