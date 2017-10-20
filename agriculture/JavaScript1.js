SetDataInfo(new Povar(mainMap.Extent.GetCenter().X, mainMap.Extent.GetCenter().Y))

function  SetDataInfo(center)
{
            if (xsPovars == null) xsPovars = GetPovars(xs);
if( PovarInsidePolygon(xsPovars,center))
{
    this.DataInfo.Text = "数据来源:天地图•杭州•萧山";
    this.DepartmentInfo.Text = "提供单位：杭州市规划局萧山规划分局";
    this.MapInfo.Text = "";
    return true;
}

return false;
}

var  xsPovars = []; 
function   GetPovars( wkt)
{
            var ps = wkt.Split(',');
 var  povars = new Povar[ps.Length];
for (var i = 0; i < ps.Length; i++)
{
    var p = ps[i].Trim().Split(' ');
    povars[i] = new Povar(Convert.ToDouble(p[0].Trim()), Convert.ToDouble(p[1].Trim()));
}
return povars;
}


function PovarInsidePolygon( polygonVertices, ptTest)
{
if (polygonVertices.Length < 3) //t a valid polygon
    return false;

var nCounter = 0;
var nPovars = polygonVertices.Length;

var s1, p1, p2;
s1 = ptTest;
p1 = polygonVertices[0];

for (var i = 1; i < nPovars; i++)
{
    p2 = polygonVertices[i % nPovars];
    if (s1.Y > Math.Min(p1.Y, p2.Y))
{
        if (s1.Y <= Math.Max(p1.Y, p2.Y))
{
            if (s1.X <= Math.Max(p1.X, p2.X))
{
                if (p1.Y != p2.Y)
{
                    var xvarers = (s1.Y - p1.Y) * (p2.X - p1.X) /
                        (p2.Y - p1.Y) + p1.X;
                    if ((p1.X == p2.X) || (s1.X <= xvarers))
{
                        nCounter++;
}
}  //p1.y != p2.y
}
}
}
    p1 = p2;
} //for loop

if ((nCounter % 2) == 0)
    return false;
else
    return true;
}
