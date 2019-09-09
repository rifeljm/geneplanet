import styled from 'styled-components';

const css = {};

css.Content = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

css.Metric = styled.div`
  align-items: center;
  background: #eee;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  margin: 10px;
  text-align: center;
  padding: 15px;
  width: 80px;
  height: 80px;
`;

css.MetricValue = styled.div`
  font-size: 18px;
  color: #22aa88;
  margin-bottom: 5px;
`;
css.MetricTitle = styled.div`
  font-size: 12px;
`;

export default css;
